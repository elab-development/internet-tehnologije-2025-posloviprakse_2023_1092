import db from '../models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { deleteFile } from '../middleware/fileUpload.js';
import { comparePassword, hashPassword } from '../utils/password.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JobSeeker = db.JobSeeker;
const User = db.User;




export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobSeeker = await JobSeeker.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture', 'emailVerified']
        }
      ]
    });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: 'Profil nije pronađen.'
      });
    }

    return res.status(200).json({
      success: true,
      data: jobSeeker
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dobijanju profila.',
      error: error.message
    });
  }
};




export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      email,
      currentPassword,
      newPassword,
      bio,
      phone,
      location,
      skills,
      experience,
      education
    } = req.body;

    const jobSeeker = await JobSeeker.findOne({ where: { userId } });
    const user = await User.findByPk(userId);

    if (!jobSeeker || !user) {
      return res.status(404).json({
        success: false,
        message: 'Profil nije pronađen.'
      });
    }

    
    if (education && !Array.isArray(education)) {
      return res.status(400).json({
        success: false,
        message: 'Education polje mora biti niz objekata.'
      });
    }

    
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills polje mora biti niz.'
      });
    }

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (skills !== undefined) updateData.skills = skills;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;

    await jobSeeker.update(updateData);

    const userUpdateData = {};
    if (firstName !== undefined) userUpdateData.firstName = firstName;
    if (lastName !== undefined) userUpdateData.lastName = lastName;

    if (email !== undefined && email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [db.Sequelize.Op.ne]: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Korisnik sa ovom email adresom već postoji.'
        });
      }

      userUpdateData.email = email;
    }

    if (currentPassword !== undefined || newPassword !== undefined) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Za promenu lozinke unesite trenutnu i novu lozinku.'
        });
      }

      const isCurrentPasswordValid = comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Trenutna lozinka nije ispravna.'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Nova lozinka mora imati najmanje 6 karaktera.'
        });
      }

      userUpdateData.password = hashPassword(newPassword);
    }

    if (Object.keys(userUpdateData).length > 0) {
      await user.update(userUpdateData);
    }

    return res.status(200).json({
      success: true,
      message: 'Profil uspešno ažuriran.',
      data: {
        ...jobSeeker.toJSON(),
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          emailVerified: user.emailVerified
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju profila.',
      error: error.message
    });
  }
};





export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(' Profile picture upload started for user:', userId);

    if (!req.file) {
      console.log(' No file provided');
      return res.status(400).json({
        success: false,
        message: 'Niste priložili sliku.'
      });
    }

    console.log(' File received:', {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const user = await User.findByPk(userId);

    if (!user) {
      console.log(' User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'Profil nije pronađen.'
      });
    }

    
    if (user.profilePicture && user.profilePicture.startsWith('/uploads/')) {
      console.log(' Attempting to delete old profile picture...');
      const oldPath = path.join(__dirname, '..', user.profilePicture);
      deleteFile(oldPath);
    }

    
    let profilePictureValue;
    
    
    if (req.file && req.file.filename) {
      profilePictureValue = `/uploads/profile-pictures/${req.file.filename}`;
      console.log(' Using file system path:', profilePictureValue);
    } else if (req.file && req.file.buffer) {
      
      const base64 = req.file.buffer.toString('base64');
      profilePictureValue = `data:${req.file.mimetype};base64,${base64}`;
      console.log(' Using Base64 encoded image (size:', base64.length, 'chars)');
    } else {
      console.log(' Invalid file object');
      return res.status(400).json({
        success: false,
        message: 'Greška pri procesiranju slike.'
      });
    }

    console.log(' Updating user profile in database...');
    await user.update({ profilePicture: profilePictureValue });

    console.log(' Profile picture upload successful for user:', userId);

    return res.status(200).json({
      success: true,
      message: 'Profilna slika uspešno ažurirana.',
      data: { profilePicture: profilePictureValue }
    });
  } catch (error) {
    console.error(' Upload profile picture error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Greška pri uploadu slike.',
      error: error.message
    });
  }
};




export const uploadCV = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Niste priložili CV fajl.'
      });
    }

    const jobSeeker = await JobSeeker.findOne({ where: { userId } });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: 'Profil nije pronađen.'
      });
    }

    
    if (jobSeeker.cv_url) {
      const oldCvPath = path.join(__dirname, '..', jobSeeker.cv_url);
      deleteFile(oldCvPath);
    }

    
    const cv_url = `/uploads/cvs/${req.file.filename}`;
    const cv_filename = req.file.originalname;
    const cv_uploadedAt = new Date();

    await jobSeeker.update({
      cv_url,
      cv_filename,
      cv_uploadedAt,
      resume: cv_url 
    });

    return res.status(200).json({
      success: true,
      message: 'CV uspešno uploadovan.',
      data: {
        cv_url,
        cv_filename,
        cv_uploadedAt
      }
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri uploadu CV-ja.',
      error: error.message
    });
  }
};




export const downloadCV = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobSeeker = await JobSeeker.findOne({ where: { userId } });

    if (!jobSeeker || !jobSeeker.cv_url) {
      return res.status(404).json({
        success: false,
        message: 'CV nije pronađen.'
      });
    }

    const cvPath = path.join(__dirname, '..', jobSeeker.cv_url);

    if (!fs.existsSync(cvPath)) {
      return res.status(404).json({
        success: false,
        message: 'CV fajl ne postoji na serveru.'
      });
    }

    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${jobSeeker.cv_filename}"`);

    return res.download(cvPath, jobSeeker.cv_filename);
  } catch (error) {
    console.error('Download CV error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri preuzimanju CV-ja.',
      error: error.message
    });
  }
};




export const deleteCV = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobSeeker = await JobSeeker.findOne({ where: { userId } });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: 'Profil nije pronađen.'
      });
    }

    if (!jobSeeker.cv_url) {
      return res.status(404).json({
        success: false,
        message: 'Nemate uploadovan CV.'
      });
    }

    
    const cvPath = path.join(__dirname, '..', jobSeeker.cv_url);
    deleteFile(cvPath);

    
    await jobSeeker.update({
      cv_url: null,
      cv_filename: null,
      cv_uploadedAt: null,
      resume: null
    });

    return res.status(200).json({
      success: true,
      message: 'CV uspešno obrisan.'
    });
  } catch (error) {
    console.error('Delete CV error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri brisanju CV-ja.',
      error: error.message
    });
  }
};




export const getPublicProfile = async (req, res) => {
  try {
    const { jobSeekerId } = req.params;

    const jobSeeker = await JobSeeker.findByPk(jobSeekerId, {
      attributes: ['id', 'bio', 'location', 'skills', 'experience', 'education', 'cv_filename', 'cv_uploadedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'role', 'profilePicture']
        }
      ]
    });

    if (!jobSeeker) {
      return res.status(404).json({
        success: false,
        message: 'Profil nije pronađen.'
      });
    }

    return res.status(200).json({
      success: true,
      data: jobSeeker
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dobijanju profila.',
      error: error.message
    });
  }
};

export default {
  getMyProfile,
  updateMyProfile,
  uploadCV,
  downloadCV,
  deleteCV,
  getPublicProfile
};
