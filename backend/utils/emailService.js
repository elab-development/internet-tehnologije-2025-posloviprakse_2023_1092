import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();







const createTransporter = () => {
  
  
  
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || 'test@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'test123'
      }
    });
  }
};





export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};








export const sendVerificationEmail = async (email, token, firstName) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"Jobzee Platform" <${process.env.SMTP_FROM || 'noreply@jobzee.com'}>`,
    to: email,
    subject: 'Verifikujte vaš Jobzee nalog',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> Dobrodošli na Jobzee!</h1>
            </div>
            <div class="content">
              <p>Pozdrav <strong>${firstName}</strong>,</p>
              <p>Hvala što ste se registrovali na Jobzee platformu. Da biste aktivirali vaš nalog, molimo vas da kliknete na dugme ispod:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verifikuj Email</a>
              </div>
              <p>Ili kopirajte i nalepite sledeći link u vaš browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p><strong>Napomena:</strong> Ovaj link ističe za 24 sata.</p>
              <p>Ako niste kreirali nalog na Jobzee platformi, molimo vas ignorišite ovaj email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Jobzee Platform. Sva prava zadržana.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Pozdrav ${firstName},
      
      Dobrodošli na Jobzee! Da verifikujete vaš nalog, kliknite na sledeći link:
      ${verificationUrl}
      
      Link ističe za 24 sata.
      
      Ako niste kreirali ovaj nalog, ignorišite ovaj email.
      
      Jobzee Platform
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(' Email sent (development mode):');
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      console.log('Verification URL: %s', verificationUrl);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Greška pri slanju verifikacionog emaila');
  }
};








export const sendPasswordResetEmail = async (email, token, firstName) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"Jobzee Platform" <${process.env.SMTP_FROM || 'noreply@jobzee.com'}>`,
    to: email,
    subject: 'Resetovanje lozinke - Jobzee',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> Resetovanje Lozinke</h1>
            </div>
            <div class="content">
              <p>Pozdrav <strong>${firstName}</strong>,</p>
              <p>Primili smo zahtev za resetovanje lozinke za vaš Jobzee nalog.</p>
              <p>Da biste resetovali lozinku, kliknite na dugme ispod:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Resetuj Lozinku</a>
              </div>
              <p>Ili kopirajte i nalepite sledeći link u vaš browser:</p>
              <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
              <div class="warning">
                <strong> Važno:</strong>
                <ul>
                  <li>Ovaj link ističe za 1 sat</li>
                  <li>Ako niste zahtevali reset lozinke, ignorišite ovaj email</li>
                  <li>Vaša lozinka ostaje nepromenjena dok ne kreirate novu</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2026 Jobzee Platform. Sva prava zadržana.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Pozdrav ${firstName},
      
      Primili smo zahtev za resetovanje lozinke. Da resetujete lozinku, kliknite na sledeći link:
      ${resetUrl}
      
      Link ističe za 1 sat.
      
      Ako niste zahtevali reset, ignorišite ovaj email.
      
      Jobzee Platform
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(' Password reset email sent (development mode):');
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      console.log('Reset URL: %s', resetUrl);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Greška pri slanju emaila za reset lozinke');
  }
};







export const sendPasswordChangeConfirmation = async (email, firstName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Jobzee Platform" <${process.env.SMTP_FROM || 'noreply@jobzee.com'}>`,
    to: email,
    subject: 'Lozinka uspešno promenjena - Jobzee',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2> Lozinka je uspešno promenjena</h2>
          <p>Pozdrav ${firstName},</p>
          <p>Ovo je potvrda da je vaša lozinka na Jobzee platformi uspešno promenjena.</p>
          <p>Ako niste vi izvršili ovu promenu, molimo vas da odmah kontaktirate našu podršku.</p>
          <p>Srdačan pozdrav,<br>Jobzee Tim</p>
        </body>
      </html>
    `
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password change confirmation:', error);
    
    return null;
  }
};

export default {
  generateToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangeConfirmation
};
