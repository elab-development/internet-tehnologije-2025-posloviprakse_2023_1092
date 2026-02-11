import express from 'express';
import { param, body } from 'express-validator';
import {
  createReview,
  getCompanyReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();


router.post('/company/:companyId',
  authenticateToken,
  authorizeRole(['job_seeker']),
  [
    param('companyId').isUUID().withMessage('Nevažeći ID kompanije'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Ocjena mora biti između 1 i 5'),
    body('comment').optional().isString()
  ],
  handleValidationErrors,
  createReview
);


router.get('/company/:companyId', [
  param('companyId').isUUID().withMessage('Nevažeći ID kompanije')
], handleValidationErrors, getCompanyReviews);


router.put('/:reviewId',
  authenticateToken,
  authorizeRole(['job_seeker']),
  [
    param('reviewId').isUUID().withMessage('Nevažeći ID recenzije'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Ocjena mora biti između 1 i 5'),
    body('comment').optional().isString()
  ],
  handleValidationErrors,
  updateReview
);


router.delete('/:reviewId',
  authenticateToken,
  authorizeRole(['job_seeker']),
  [
    param('reviewId').isUUID().withMessage('Nevažeći ID recenzije')
  ],
  handleValidationErrors,
  deleteReview
);

export default router;
