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
import { sendTestEmail } from '../controllers/adminController.js';

const router = express.Router();


router.use(authenticateToken, authorizeRole(['admin']));

// Test route for sending email (for admin only)
router.post('/test-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const info = await sendTestEmail(to, subject, text);
    res.json({ success: true, info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});






router.get('/dashboard', getDashboardStats);






router.get('/jobs/pending', getPendingJobs);






router.put(
  '/jobs/:jobId/approve',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  approveJob
);






router.put(
  '/jobs/:jobId/reject',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa'),
    body('reason').notEmpty().withMessage('Razlog odbijanja je obavezan')
  ],
  handleValidationErrors,
  rejectJob
);






router.put(
  '/jobs/:jobId/archive',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  archiveJob
);







router.get('/users', getAllUsers);






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






router.put(
  '/users/:userId/deactivate',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika')
  ],
  handleValidationErrors,
  deactivateUser
);






router.put(
  '/users/:userId/reactivate',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika')
  ],
  handleValidationErrors,
  reactivateUser
);






router.delete(
  '/users/:userId',
  [
    param('userId').isUUID().withMessage('Nevažeći ID korisnika')
  ],
  handleValidationErrors,
  deleteUser
);






router.delete(
  '/jobs/:jobId',
  [
    param('jobId').isUUID().withMessage('Nevažeći ID oglasa')
  ],
  handleValidationErrors,
  deleteJobAdmin
);

export default router;
