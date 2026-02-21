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






router.get(
  '/profile',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  getMyProfile
);






router.put(
  '/profile',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  [
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Nevažeća email adresa'),
    body('currentPassword').optional({ checkFalsy: true }).isString().withMessage('Trenutna lozinka nije validna'),
    body('newPassword').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Nova lozinka mora imati najmanje 6 karaktera'),
    body('phone').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Nevažeći broj telefona'),
    body('skills').optional({ checkFalsy: true }).isArray().withMessage('Skills mora biti niz'),
    body('education').optional({ checkFalsy: true }).isArray().withMessage('Education mora biti niz'),
    body('experience').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Experience mora biti pozitivan broj')
  ],
  handleValidationErrors,
  updateMyProfile
);






router.post(
  '/profile-picture',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  uploadProfilePicture,
  handleUploadError,
  uploadProfilePictureController
);






router.post(
  '/cv/upload',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  uploadCV,
  handleUploadError,
  uploadCVController
);






router.get(
  '/cv/download',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  downloadCV
);






router.delete(
  '/cv',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  deleteCV
);






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
