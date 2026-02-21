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


router.get('/', getAllCompanies);


router.get('/profile/me',
  authenticateToken,
  authorizeRole(['company', 'admin']),
  getMyCompanyProfile
);


router.get('/:companyId', [
  param('companyId').isUUID().withMessage('Nevažeći ID kompanije')
], handleValidationErrors, getCompanyProfile);


router.put('/profile',
  authenticateToken,
  authorizeRole(['company', 'admin']),
  [
    body('firstName').optional({ checkFalsy: true }).isString(),
    body('lastName').optional({ checkFalsy: true }).isString(),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Nevažeća email adresa'),
    body('currentPassword').optional({ checkFalsy: true }).isString().withMessage('Trenutna lozinka nije validna'),
    body('newPassword').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Nova lozinka mora imati najmanje 6 karaktera'),
    body('companyName').optional({ checkFalsy: true }).isString(),
    body('description').optional({ checkFalsy: true }).isString(),
    body('website').optional({ checkFalsy: true }).isURL(),
    body('industry').optional({ checkFalsy: true }).isString(),
    body('location').optional({ checkFalsy: true }).isString(),
    body('employees').optional({ checkFalsy: true }).isInt()
  ],
  handleValidationErrors,
  updateCompanyProfile
);


router.post('/logo',
  authenticateToken,
  authorizeRole(['company', 'admin']),
  uploadProfilePicture,
  handleUploadError,
  uploadCompanyLogo
);

export default router;
