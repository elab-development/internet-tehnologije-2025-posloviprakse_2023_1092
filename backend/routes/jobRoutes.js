import express from 'express';
import { body, param } from 'express-validator';
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  archiveJob,
  deleteJob
} from '../controllers/jobController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Create job (only company/alumni)
router.post('/', 
  authenticateToken,
  authorizeRole(['company', 'alumni', 'admin']),
  [
    body('title').notEmpty().withMessage('Naslov je obavezan'),
    body('description').notEmpty().withMessage('Opis je obavezan'),
    body('category').notEmpty().withMessage('Kategorija je obavezna'),
    body('location').notEmpty().withMessage('Lokacija je obavezna'),
    body('jobType').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']),
    body('experienceLevel').optional().isIn(['Entry', 'Mid', 'Senior'])
  ],
  handleValidationErrors,
  createJob
);

// Get all jobs
router.get('/', getAllJobs);

// Get my jobs (only authenticated company/alumni)
router.get('/my-jobs',
  authenticateToken,
  authorizeRole(['company', 'alumni']),
  getMyJobs
);

// Get job by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Nevažeći ID oglasa')
], handleValidationErrors, getJobById);

// Update job (only owner)
router.put('/:id',
  authenticateToken,
  authorizeRole(['company', 'alumni', 'admin']),
  [
    param('id').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  updateJob
);

// Archive job (only owner)
router.put('/:jobId/archive',
  authenticateToken,
  authorizeRole(['company', 'alumni']),
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  archiveJob
);

// Delete job (only owner)
router.delete('/:id',
  authenticateToken,
  authorizeRole(['company', 'alumni', 'admin']),
  [
    param('id').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  deleteJob
);

export default router;
