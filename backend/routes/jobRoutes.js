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


router.get('/', getAllJobs);


router.get('/my-jobs',
  authenticateToken,
  authorizeRole(['company', 'alumni']),
  getMyJobs
);


router.get('/:id', [
  param('id').isUUID().withMessage('Nevažeći ID oglasa')
], handleValidationErrors, getJobById);


router.put('/:id',
  authenticateToken,
  authorizeRole(['company', 'alumni', 'admin']),
  [
    param('id').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  updateJob
);


router.put('/:jobId/archive',
  authenticateToken,
  authorizeRole(['company', 'alumni']),
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  archiveJob
);


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
