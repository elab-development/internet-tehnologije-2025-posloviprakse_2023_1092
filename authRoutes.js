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

/**
 * @route   POST /api/auth/register
 * @desc    Registracija novog korisnika
 * @access  Public
 */
router.post('/register', [
  body('firstName').notEmpty().withMessage('Ime je obavezno'),
  body('lastName').notEmpty().withMessage('Prezime je obavezno'),
  body('email').isEmail().withMessage('Nevažeća email adresa'),
  body('password').isLength({ min: 6 }).withMessage('Lozinka mora imati najmanje 6 karaktera'),
  body('role').optional().isIn(['student', 'alumni', 'company', 'admin']).withMessage('Nevažeća uloga. Dozvoljene: student, alumni, company, admin')
], handleValidationErrors, register);

/**
 * @route   POST /api/auth/login
 * @desc    Prijava korisnika
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail().withMessage('Nevažeća email adresa'),
  body('password').notEmpty().withMessage('Lozinka je obavezna')
], handleValidationErrors, login);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verifikacija email adrese
 * @access  Public
 */
router.post('/verify-email', [
  body('token').notEmpty().withMessage('Token je obavezan')
], handleValidationErrors, verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Zahtev za resetovanje lozinke
 * @access  Public
 */
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Nevažeća email adresa')
], handleValidationErrors, forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Resetovanje lozinke sa tokenom
 * @access  Public
 */
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token je obavezan'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova lozinka mora imati najmanje 6 karaktera')
], handleValidationErrors, resetPassword);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Ponovno slanje verifikacijskog emaila
 * @access  Public
 */
router.post('/resend-verification', [
  body('email').isEmail().withMessage('Nevažeća email adresa')
], handleValidationErrors, resendVerificationEmail);

/**
 * @route   POST /api/auth/logout
 * @desc    Odjava korisnika
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Dobijanje trenutno ulogovanog korisnika
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;
