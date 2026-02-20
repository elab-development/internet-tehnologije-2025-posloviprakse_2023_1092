import db from '../models/index.js';
import { Op } from 'sequelize';

const User = db.User;
const Job = db.Job;
const Application = db.Application;
const Company = db.Company;
const JobSeeker = db.JobSeeker;
const Review = db.Review;





export const getDashboardStats = async (req, res) => {
  try {
    
    const userStats = await User.findAll({
      attributes: [
        'role',
        [db.sequelize.fn('COUNT', db.sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    
    const jobStats = await Job.findAll({
      attributes: [
        'approvalStatus',
        [db.sequelize.fn('COUNT', db.sequelize.col('approvalStatus')), 'count']
      ],
      group: ['approvalStatus']
    });

    
    const applicationStats = await Application.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    const recentJobs = await Job.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    const recentApplications = await Application.count({
      where: {
        appliedAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    
    const verifiedUsers = await User.count({
      where: { emailVerified: true }
    });

    const unverifiedUsers = await User.count({
      where: { emailVerified: false }
    });

    
    const topCompanies = await Company.findAll({
      attributes: [
        'id',
        'companyName',
        'rating',
        [db.sequelize.fn('COUNT', db.sequelize.col('jobs.id')), 'jobCount']
      ],
      include: [
        {
          model: Job,
          as: 'jobs',
          attributes: [],
          required: false
        }
      ],
      group: ['Company.id'],
      order: [[db.sequelize.fn('COUNT', db.sequelize.col('jobs.id')), 'DESC']],
      limit: 5
    });

    return res.status(200).json({
      success: true,
      data: {
        users: {
          byRole: userStats,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          recent30Days: recentUsers
        },
        jobs: {
          byStatus: jobStats,
          recent30Days: recentJobs
        },
        applications: {
          byStatus: applicationStats,
          recent30Days: recentApplications
        },
        topCompanies
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvatanju statistika.',
      error: error.message
    });
  }
};




export const getPendingJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: {
        approvalStatus: 'pending'
      },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'companyName', 'industry', 'location'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pending jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvatanju oglasa.',
      error: error.message
    });
  }
};




export const approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const adminId = req.user.id;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    if (job.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Oglas je već odobren.'
      });
    }

    await job.update({
      approvalStatus: 'approved',
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: null
    });

    return res.status(200).json({
      success: true,
      message: 'Oglas je uspešno odobren.',
      data: job
    });
  } catch (error) {
    console.error('Approve job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri odobravanju oglasa.',
      error: error.message
    });
  }
};




export const rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Razlog odbijanja je obavezan.'
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    await job.update({
      approvalStatus: 'rejected',
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: reason
    });

    return res.status(200).json({
      success: true,
      message: 'Oglas je odbijen.',
      data: job
    });
  } catch (error) {
    console.error('Reject job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri odbijanju oglasa.',
      error: error.message
    });
  }
};




export const archiveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    await job.update({
      isActive: false
    });

    return res.status(200).json({
      success: true,
      message: 'Oglas je arhiviran.',
      data: job
    });
  } catch (error) {
    console.error('Archive job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri arhiviranju oglasa.',
      error: error.message
    });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    console.log(' getAllUsers called by user:', req.user?.id, 'role:', req.user?.role);

    const { role, isActive, emailVerified, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    console.log(' Query params:', { role, isActive, emailVerified, page, limit, offset });

    const whereClause = {};
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (emailVerified !== undefined) whereClause.emailVerified = emailVerified === 'true';

    console.log(' Where clause:', whereClause);

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
      include: [
        {
          model: JobSeeker,
          as: 'jobSeeker',
          required: false
        },
        {
          model: Company,
          as: 'company',
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log(' Users found:', count, 'rows returned:', users.length);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error(' Get all users error:', error.name, error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvatanju korisnika.',
      error: error.message
    });
  }
};




export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    const allowedRoles = ['student', 'alumni', 'company', 'admin'];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: `Nevažeća uloga. Dozvoljene: ${allowedRoles.join(', ')}`
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen.'
      });
    }

    
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Ne možete promeniti sopstvenu ulogu.'
      });
    }

    const oldRole = user.role;
    await user.update({ role: newRole });

    return res.status(200).json({
      success: true,
      message: `Uloga korisnika promenjena sa "${oldRole}" na "${newRole}".`,
      data: {
        id: user.id,
        email: user.email,
        oldRole,
        newRole
      }
    });
  } catch (error) {
    console.error('Change user role error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri promeni uloge.',
      error: error.message
    });
  }
};




export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen.'
      });
    }

    
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Ne možete deaktivirati sopstveni nalog.'
      });
    }

    await user.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: 'Korisnički nalog je deaktiviran.',
      data: {
        id: user.id,
        email: user.email,
        isActive: false
      }
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri deaktivaciji korisnika.',
      error: error.message
    });
  }
};




export const reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen.'
      });
    }

    await user.update({ isActive: true });

    return res.status(200).json({
      success: true,
      message: 'Korisnički nalog je reaktiviran.',
      data: {
        id: user.id,
        email: user.email,
        isActive: true
      }
    });
  } catch (error) {
    console.error('Reactivate user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri reaktivaciji korisnika.',
      error: error.message
    });
  }
};




export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(' deleteUser called - Admin:', req.user?.id, 'Target user:', userId);

    const user = await User.findByPk(userId);

    if (!user) {
      console.log(' User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen.'
      });
    }

    
    if (user.id === req.user.id) {
      console.log(' Admin tried to delete themselves');
      return res.status(400).json({
        success: false,
        message: 'Ne možete obrisati sami sebe.'
      });
    }

    console.log(' Destroying user:', user.email);
    await user.destroy();

    console.log(' User deleted successfully:', user.email);

    return res.status(200).json({
      success: true,
      message: 'Korisnik je uspješno obrisan!'
    });
  } catch (error) {
    console.error(' Delete user error:', error.name, error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Greška pri brisanju korisnika.',
      error: error.message
    });
  }
};




export const deleteJobAdmin = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    console.log(' deleteJobAdmin called - Admin:', req.user?.id, 'Target job:', jobId);

    const job = await Job.findByPk(jobId);

    if (!job) {
      console.log(' Job not found:', jobId);
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    console.log(' Destroying job:', job.title);
    await job.destroy();

    console.log(' Job deleted successfully:', job.title);

    return res.status(200).json({
      success: true,
      message: 'Oglas je uspješno obrisan!'
    });
  } catch (error) {
    console.error(' Delete job error:', error.name, error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Greška pri brisanju oglasa.',
      error: error.message
    });
  }
};

export default {
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
};
