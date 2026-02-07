import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture as uploadProfilePictureController,
  uploadCV as uploadCVController,
  downloadCV,
  deleteCV,
  getPublicProfile
} from '../controllers/studentController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { uploadCV, uploadProfilePicture, handleUploadError } from '../middleware/fileUpload.js';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/student/profile
 * @desc    Dobijanje sopstvenog profila (student/alumni)
 * @access  Student, Alumni
 */
router.get(
  '/profile',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  getMyProfile
);

/**
 * @route   PUT /api/student/profile
 * @desc    Ažuriranje sopstvenog profila
 * @access  Student, Alumni
 */
router.put(
  '/profile',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  [
    body('phone').optional().isMobilePhone('any').withMessage('Nevažeći broj telefona'),
    body('skills').optional().isArray().withMessage('Skills mora biti niz'),
    body('education').optional().isArray().withMessage('Education mora biti niz'),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience mora biti pozitivan broj')
  ],
  handleValidationErrors,
  updateMyProfile
);

/**
 * @route   POST /api/student/profile-picture
 * @desc    Upload profilne slike
 * @access  Student, Alumni
 */
router.post(
  '/profile-picture',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  uploadProfilePicture,
  handleUploadError,
  uploadProfilePictureController
);

/**
 * @route   POST /api/student/cv/upload
 * @desc    Upload CV fajla (PDF, DOC, DOCX)
 * @access  Student, Alumni
 */
router.post(
  '/cv/upload',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  uploadCV,
  handleUploadError,
  uploadCVController
);

/**
 * @route   GET /api/student/cv/download
 * @desc    Download sopstvenog CV-ja
 * @access  Student, Alumni
 */
router.get(
  '/cv/download',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  downloadCV
);

/**
 * @route   DELETE /api/student/cv
 * @desc    Brisanje CV-ja
 * @access  Student, Alumni
 */
router.delete(
  '/cv',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  deleteCV
);

/**
 * @route   GET /api/student/:jobSeekerId/public
 * @desc    Javni profil studenta/alumni (za kompanije)
 * @access  Public (ali korisno za company)
 */
router.get(
  '/:jobSeekerId/public',
  authenticateToken,
  [
    param('jobSeekerId').isUUID().withMessage('Nevažeći ID studenta')
  ],
  handleValidationErrors,
  getPublicProfile
);

export default router;
