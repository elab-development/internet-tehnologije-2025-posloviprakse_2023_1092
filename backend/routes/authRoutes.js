import express from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  logout, 
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();






router.post('/register', [
  body('firstName').notEmpty().withMessage('Ime je obavezno'),
  body('lastName').notEmpty().withMessage('Prezime je obavezno'),
  body('email').isEmail().withMessage('Nevažeća email adresa'),
  body('password').isLength({ min: 6 }).withMessage('Lozinka mora imati najmanje 6 karaktera'),
  body('role').optional().isIn(['student', 'alumni', 'company', 'admin']).withMessage('Nevažeća uloga. Dozvoljene: student, alumni, company, admin')
], handleValidationErrors, register);






router.post('/login', [
  body('email').isEmail().withMessage('Nevažeća email adresa'),
  body('password').notEmpty().withMessage('Lozinka je obavezna')
], handleValidationErrors, login);






router.post('/verify-email', [
  body('token').notEmpty().withMessage('Token je obavezan')
], handleValidationErrors, verifyEmail);






router.post('/forgot-password', [
  body('email').isEmail().withMessage('Nevažeća email adresa')
], handleValidationErrors, forgotPassword);






router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token je obavezan'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova lozinka mora imati najmanje 6 karaktera')
], handleValidationErrors, resetPassword);






router.post('/resend-verification', [
  body('email').isEmail().withMessage('Nevažeća email adresa')
], handleValidationErrors, resendVerificationEmail);






router.post('/logout', authenticateToken, logout);






router.get('/me', authenticateToken, getCurrentUser);

export default router;
