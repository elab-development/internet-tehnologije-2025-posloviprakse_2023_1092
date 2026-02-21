import db from '../models/index.js';

const Application = db.Application;
const Job = db.Job;
const JobSeeker = db.JobSeeker;

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    
    const jobSeeker = await JobSeeker.findOne({ where: { userId: req.user.id } });

    if (!jobSeeker) {
      return res.status(403).json({
        success: false,
        message: 'Samo pretražiatelji poslova mogu se prijaviti.'
      });
    }

    
    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    
    const existingApplication = await Application.findOne({
      where: { jobId, jobSeekerId: jobSeeker.id }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Već ste se prijavili za ovaj oglas.'
      });
    }

    const cvUrl = req.file ? `/uploads/cvs/${req.file.filename}` : null;
    const cvFilename = req.file ? req.file.originalname : null;

    const application = await Application.create({
      jobId,
      jobSeekerId: jobSeeker.id,
      coverLetter,
      cvUrl,
      cvFilename
    });

    return res.status(201).json({
      success: true,
      message: 'Prijava je uspješno poslana!',
      data: application
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri slanju prijave.',
      error: error.message
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ where: { userId: req.user.id } });

    if (!jobSeeker) {
      return res.status(403).json({
        success: false,
        message: 'Samo pretražiatelji poslova mogu dohvatiti prijave.'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const where = { jobSeekerId: jobSeeker.id };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [{
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'location', 'jobType', 'salary'],
        include: [{
          model: db.Company,
          as: 'company',
          attributes: ['companyName', 'logo']
        }]
      }],
      offset,
      limit: parseInt(limit),
      order: [['appliedAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju prijava.',
      error: error.message
    });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId, {
      include: [{ model: db.Company, as: 'company' }]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    if (job.company.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovim prijavama.'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Application.findAndCountAll({
      where: { jobId },
      attributes: ['id', 'jobId', 'jobSeekerId', 'status', 'coverLetter', 'cvUrl', 'cvFilename', 'appliedAt', 'createdAt', 'updatedAt'],
      include: [{
        model: JobSeeker,
        as: 'jobSeeker',
        attributes: ['id', 'phone', 'location', 'skills', 'cv_url', 'cv_filename'],
        include: [{ model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }]
      }],
      offset,
      limit: parseInt(limit),
      order: [['appliedAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju prijava.',
      error: error.message
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(applicationId, {
      include: [{ model: Job, as: 'job', include: [{ model: db.Company, as: 'company' }] }]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Prijava nije pronađena.'
      });
    }

    if (application.job.company.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovoj prijavi.'
      });
    }

    const validStatuses = ['applied', 'reviewing', 'interview', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Nevažečи status.'
      });
    }

    await application.update({ status });

    return res.status(200).json({
      success: true,
      message: 'Status prijave je uspješno ažuriran!',
      data: application
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju statusa.',
      error: error.message
    });
  }
};
