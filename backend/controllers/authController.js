import db from '../models/index.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { 
  generateToken as generateEmailToken, 
  sendVerificationEmail, 
  sendPasswordResetEmail,
  sendPasswordChangeConfirmation 
} from '../utils/emailService.js';

const User = db.User;





export const register = async (req, res) => {
  try {
    console.log(' Starting registration process...');
    const { firstName, lastName, email, password, role } = req.body;

    console.log(' Step 1: Validating input...');
    if (!firstName || !lastName || !email || !password) {
      console.log(' Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Sva polja su obavezna'
      });
    }

    
    const allowedRoles = ['student', 'alumni', 'company', 'admin'];
    if (role && !allowedRoles.includes(role)) {
      console.log(' Invalid role:', role);
      return res.status(400).json({
        success: false,
        message: `Nevažeća uloga. Dozvoljene uloge: ${allowedRoles.join(', ')}`
      });
    }

    console.log(' Step 2: Checking if user exists...');
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log(' User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Korisnik sa ovom email adresom već postoji.'
      });
    }

    console.log(' Step 3: Hashing password...');
    
    const hashedPassword = hashPassword(password);

    
    const emailVerificationToken = generateEmailToken();

    console.log(' Step 4: Creating user in database...');
    
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'student',
      emailVerificationToken,
      emailVerified: false
    });
    console.log(' User created with ID:', newUser.id);

    console.log(' Step 5: Creating role-specific profile...');
    
    if (newUser.role === 'student' || newUser.role === 'alumni') {
      await db.JobSeeker.create({ 
        userId: newUser.id,
        bio: null,
        phone: null,
        location: null,
        education: []
      });
      console.log(' JobSeeker profile created');
    } else if (newUser.role === 'company') {
      await db.Company.create({
        userId: newUser.id,
        companyName: `${firstName} ${lastName} Company`,
        description: null,
        industry: null,
        location: null
      });
      console.log(' Company profile created');
    }

    console.log(' Step 6: Generating JWT token...');
    
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    
    
    if (process.env.NODE_ENV === 'production') {
      sendVerificationEmail(email, emailVerificationToken, firstName).catch((err) => {
        console.error(' Email sending failed (non-blocking):', err.message);
      });
    } else {
      console.log(' Email verification skipped in development mode');
    }

    console.log(' Registration completed successfully!');
    return res.status(201).json({
      success: true,
      message: 'Registracija uspešna! Dobrodošli na Jobzee!',
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
        token
      }
    });
  } catch (error) {
    console.error(' Registration error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Greška pri registraciji.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Interno smo napravili grešku'
    });
  }
};





export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(' Login attempt for email:', email);

    
    console.log(' Finding user...');
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(' User not found:', email);
      return res.status(400).json({
        success: false,
        message: 'Nevažeća email adresa ili lozinka.'
      });
    }

    console.log(' User found:', user.id);

    
    console.log(' Comparing passwords...');
    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      console.log(' Invalid password');
      return res.status(400).json({
        success: false,
        message: 'Nevažeća email adresa ili lozinka.'
      });
    }

    console.log(' Password valid');

    
    if (!user.isActive) {
      console.log(' Account inactive');
      return res.status(403).json({
        success: false,
        message: 'Vaš nalog je deaktiviran. Kontaktirajte administratora.'
      });
    }

    console.log(' Account is active');

    
    const emailWarning = !user.emailVerified 
      ? 'Vaš email nije verifikovan. Proverite inbox za verifikacioni link.' 
      : null;

    
    console.log(' Updating lastLogin...');
    await user.update({ lastLogin: new Date() });

    
    console.log(' Generating JWT token...');
    const token = generateToken(user.id, user.email, user.role);

    console.log(' Login successful for:', email);

    return res.status(200).json({
      success: true,
      message: 'Login uspešan!',
      warning: emailWarning,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture,
        token
      }
    });
  } catch (error) {
    console.error(' Login error - DETAILED:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.sql) console.error('SQL:', error.sql);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    return res.status(500).json({
      success: false,
      message: 'Greška pri logovanju.',
      error: error.message,
      errorName: error.name
    });
  }
};





export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verifikacioni token je obavezan.'
      });
    }

    
    const user = await User.findOne({ 
      where: { emailVerificationToken: token } 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Nevažeći ili istekli verifikacioni token.'
      });
    }

    
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email je već verifikovan.'
      });
    }

    
    await user.update({
      emailVerified: true,
      emailVerificationToken: null
    });

    return res.status(200).json({
      success: true,
      message: 'Email uspešno verifikovan! Možete se prijaviti.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri verifikaciji emaila.',
      error: error.message
    });
  }
};





export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email adresa je obavezna.'
      });
    }

    
    const user = await User.findOne({ where: { email } });

    if (!user) {
      
      return res.status(200).json({
        success: true,
        message: 'Ako nalog sa ovim emailom postoji, poslaćemo instrukcije za reset lozinke.'
      });
    }

    
    const resetToken = generateEmailToken();
    const resetExpires = new Date(Date.now() + 3600000); 

    await user.update({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires
    });

    
    try {
      await sendPasswordResetEmail(email, resetToken, user.firstName);
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Greška pri slanju emaila. Pokušajte ponovo.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Instrukcije za reset lozinke su poslate na vaš email.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri obradi zahteva.',
      error: error.message
    });
  }
};





export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token i nova lozinka su obavezni.'
      });
    }

    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nova lozinka mora imati najmanje 6 karaktera.'
      });
    }

    
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          [db.Sequelize.Op.gt]: new Date() 
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Nevažeći ili istekli reset token.'
      });
    }

    
    const hashedPassword = hashPassword(newPassword);

    
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    
    try {
      await sendPasswordChangeConfirmation(user.email, user.firstName);
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      
    }

    return res.status(200).json({
      success: true,
      message: 'Lozinka uspešno promenjena! Možete se prijaviti sa novom lozinkom.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri resetovanju lozinke.',
      error: error.message
    });
  }
};




export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik sa ovim emailom ne postoji.'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email je već verifikovan.'
      });
    }

    
    const newToken = generateEmailToken();
    await user.update({ emailVerificationToken: newToken });

    
    await sendVerificationEmail(email, newToken, user.firstName);

    return res.status(200).json({
      success: true,
      message: 'Verifikacioni email ponovno poslat.'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri slanju emaila.',
      error: error.message
    });
  }
};




export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Uspešno ste se odjavili.'
  });
};




export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
      include: [
        {
          model: db.JobSeeker,
          as: 'jobSeeker',
          required: false
        },
        {
          model: db.Company,
          as: 'company',
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen.'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dobijanju profila korisnika.',
      error: error.message
    });
  }
};

export default {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  logout,
  getCurrentUser
};
