import express from 'express';
import { 
  getDashboardStats,
  getPendingJobs,
  approveJob,
  rejectJob,
  archiveJob,
  getAllUsers,
  changeUserRole,
  deactivateUser,
  reactivateUser,
  deleteUser,
  deleteJobAdmin
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Sve admin rute zahtevaju autentifikaciju i admin ulogu
router.use(authenticateToken, authorizeRole(['admin']));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Dobijanje dashboard statistika
 * @access  Admin
 */
router.get('/dashboard', getDashboardStats);

/**
 * @route   GET /api/admin/jobs/pending
 * @desc    Dobijanje svih oglasa koji čekaju odobrenje
 * @access  Admin
 */
router.get('/jobs/pending', getPendingJobs);

/**
 * @route   PUT /api/admin/jobs/:jobId/approve
 * @desc    Odobravanje oglasa
 * @access  Admin
 */
router.put(
  '/jobs/:jobId/approve',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  approveJob
);

/**
 * @route   PUT /api/admin/jobs/:jobId/reject
 * @desc    Odbijanje oglasa sa razlogom
 * @access  Admin
 */
router.put(
  '/jobs/:jobId/reject',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa'),
    body('reason').notEmpty().withMessage('Razlog odbijanja je obavezan')
  ],
  handleValidationErrors,
  rejectJob
);

/**
 * @route   PUT /api/admin/jobs/:jobId/archive
 * @desc    Arhiviranje oglasa
 * @access  Admin
 */
router.put(
  '/jobs/:jobId/archive',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  archiveJob
);

/**
 * @route   GET /api/admin/users
 * @desc    Dobijanje svih korisnika sa filterima
 * @access  Admin
 * @query   role, isActive, emailVerified, page, limit
 */
router.get('/users', getAllUsers);

/**
 * @route   PUT /api/admin/users/:userId/role
 * @desc    Promena uloge korisnika
 * @access  Admin
 */
router.put(
  '/users/:userId/role',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika'),
    body('newRole')
      .isIn(['student', 'alumni', 'company', 'admin'])
      .withMessage('Nevažeća uloga. Dozvoljene: student, alumni, company, admin')
  ],
  handleValidationErrors,
  changeUserRole
);

/**
 * @route   PUT /api/admin/users/:userId/deactivate
 * @desc    Deaktivacija korisničkog naloga
 * @access  Admin
 */
router.put(
  '/users/:userId/deactivate',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika')
  ],
  handleValidationErrors,
  deactivateUser
);

/**
 * @route   PUT /api/admin/users/:userId/reactivate
 * @desc    Reaktivacija korisničkog naloga
 * @access  Admin
 */
router.put(
  '/users/:userId/reactivate',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika')
  ],
  handleValidationErrors,
  reactivateUser
);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Brisanje korisnika
 * @access  Admin
 */
router.delete(
  '/users/:userId',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika')
  ],
  handleValidationErrors,
  deleteUser
);

/**
 * @route   DELETE /api/admin/jobs/:jobId
 * @desc    Brisanje oglasa (admin)
 * @access  Admin
 */
router.delete(
  '/jobs/:jobId',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  deleteJobAdmin
);

export default router;
