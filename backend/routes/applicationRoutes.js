import express from 'express';
import { param, body, query } from 'express-validator';
import {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { uploadCV, handleUploadError } from '../middleware/fileUpload.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();


router.post('/apply/:jobId',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  uploadCV,
  handleUploadError,
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa'),
    body('coverLetter').optional().isString()
  ],
  handleValidationErrors,
  applyForJob
);


router.get('/my-applications',
  authenticateToken,
  authorizeRole(['student', 'alumni']),
  getMyApplications
);


router.get('/job/:jobId',
  authenticateToken,
  authorizeRole(['company', 'alumni', 'admin']),
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  getApplicationsForJob
);


router.put('/:applicationId/status',
  authenticateToken,
  authorizeRole(['company', 'alumni', 'admin']),
  [
    param('applicationId').isUUID().withMessage('Nevažeći ID prijave'),
    body('status').isIn(['applied', 'reviewing', 'interview', 'rejected', 'accepted']).withMessage('Nevažeći status')
  ],
  handleValidationErrors,
  updateApplicationStatus
);

export default router;
