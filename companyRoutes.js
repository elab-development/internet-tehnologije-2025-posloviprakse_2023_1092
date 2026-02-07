import express from 'express';
import { param, body } from 'express-validator';
import {
  getCompanyProfile,
  getMyCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
  getAllCompanies
} from '../controllers/companyController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { uploadProfilePicture, handleUploadError } from '../middleware/fileUpload.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get all companies
router.get('/', getAllCompanies);

// Get my company profile
router.get('/profile/me',
  authenticateToken,
  authorizeRole(['company', 'admin']),
  getMyCompanyProfile
);

// Get company profile
router.get('/:companyId', [
  param('companyId').isUUID().withMessage('Nevažeći ID kompanije')
], handleValidationErrors, getCompanyProfile);

// Update company profile (only owner)
router.put('/profile',
  authenticateToken,
  authorizeRole(['company', 'admin']),
  [
    body('companyName').optional().isString(),
    body('description').optional().isString(),
    body('website').optional().isURL(),
    body('industry').optional().isString(),
    body('location').optional().isString(),
    body('employees').optional().isInt()
  ],
  handleValidationErrors,
  updateCompanyProfile
);

// Upload company logo
router.post('/logo',
  authenticateToken,
  authorizeRole(['company', 'admin']),
  uploadProfilePicture,
  handleUploadError,
  uploadCompanyLogo
);

export default router;
