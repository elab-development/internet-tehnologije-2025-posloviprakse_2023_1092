import db from '../models/index.js';

const Job = db.Job;
const Company = db.Company;
const User = db.User;

export const createJob = async (req, res) => {
  try {
    const { title, description, category, location, salary, jobType, experienceLevel, requiredSkills, deadline } = req.body;

    // Get company by user
    let company = await Company.findOne({ where: { userId: req.user.id } });

    if (!company && req.user.role === 'alumni') {
      const user = await User.findByPk(req.user.id);
      const uniqueSuffix = user.id ? user.id.slice(0, 6) : Date.now().toString().slice(-6);
      const companyName = `Alumni ${user.firstName} ${user.lastName} ${uniqueSuffix}`;

      company = await Company.create({
        userId: user.id,
        companyName,
        description: null,
        industry: 'Alumni',
        location: null
      });
    }

    if (!company) {
      return res.status(403).json({
        success: false,
        message: 'Samo kompanije i alumni mogu kreirati oglase.'
      });
    }

    const job = await Job.create({
      companyId: company.id,
      title,
      description,
      category,
      location,
      salary,
      jobType,
      experienceLevel,
      requiredSkills: requiredSkills || [],
      deadline,
      approvalStatus: 'pending', // Oglasi čekaju odobrenje administratora
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: 'Oglas kreiran! Čeka odobrenje administratora.',
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju oglasa.',
      error: error.message
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { 
      category, 
      location, 
      jobType, 
      experienceLevel,
      search,
      minSalary,
      maxSalary,
      page = 1, 
      limit = 10 
    } = req.query;

    // Oglasi dostupni javnosti: samo aktivni (bez obzira na approval status za development)
    const where = { 
      isActive: true
      // Uklonjen approvalStatus filter za development - svi će biti vidljivi
    };

    // Filteri
    if (category) where.category = category;
    if (location) where.location = { [db.Sequelize.Op.iLike]: `%${location}%` };
    if (jobType) where.jobType = jobType;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    // Search filter (pretraga u title i description)
    if (search) {
      where[db.Sequelize.Op.or] = [
        { title: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      where.salary = {};
      if (minSalary) where.salary[db.Sequelize.Op.gte] = parseFloat(minSalary);
      if (maxSalary) where.salary[db.Sequelize.Op.lte] = parseFloat(maxSalary);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'companyName', 'logo', 'website', 'industry']
      }],  
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      },
      filters: {
        category,
        location,
        jobType,
        experienceLevel,
        search,
        salaryRange: { min: minSalary, max: maxSalary }
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju oglasa.',
      error: error.message
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const include = [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'companyName', 'description', 'website', 'location', 'logo']
      }
    ];

    if (req.user?.id) {
      const jobSeeker = await db.JobSeeker.findOne({ where: { userId: req.user.id } });
      if (jobSeeker) {
        include.push({
          model: db.Application,
          attributes: ['id', 'jobSeekerId', 'status'],
          where: { jobSeekerId: jobSeeker.id },
          required: false
        });
      }
    }

    const job = await Job.findByPk(req.params.id, { include });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju oglasa.',
      error: error.message
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    const company = await Company.findByPk(job.companyId);

    if (company.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovom oglasu.'
      });
    }

    const { title, description, category, location, salary, jobType, experienceLevel, requiredSkills, isActive, deadline } = req.body;

    await job.update({
      title: title || job.title,
      description: description || job.description,
      category: category || job.category,
      location: location || job.location,
      salary: salary || job.salary,
      jobType: jobType || job.jobType,
      experienceLevel: experienceLevel || job.experienceLevel,
      requiredSkills: requiredSkills || job.requiredSkills,
      isActive: isActive !== undefined ? isActive : job.isActive,
      deadline: deadline || job.deadline
    });

    return res.status(200).json({
      success: true,
      message: 'Oglas je uspješno ažuriran!',
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju oglasa.',
      error: error.message
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    const company = await Company.findByPk(job.companyId);

    if (company.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovom oglasu.'
      });
    }

    await job.destroy();

    return res.status(200).json({
      success: true,
      message: 'Oglas je uspješno obrisan!'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri brisanju oglasa.',
      error: error.message
    });
  }
};
/**
 * Dobavi sve oglase kompanije/alumni-ja koji je ulogovan
 * Samo za company i alumni role
 */
export const getMyJobs = async (req, res) => {
  try {
    // Pronađi kompaniju za trenutnog korisnika
    let company = await Company.findOne({ where: { userId: req.user.id } });

    if (!company) {
      // Ako je alumni i nema company, pretraga po alumni uslov
      if (req.user.role === 'alumni') {
        const jobs = await Job.findAll({
          include: [{
            model: Company,
            as: 'company',
            where: { userId: req.user.id },
            required: true,
            attributes: ['id', 'companyName', 'logo', 'website', 'industry']
          }],
          order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
          success: true,
          data: jobs
        });
      }

      // Ako nema kompanije i nije alumni, nema oglasa
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Pronađi sve oglase kompanije
    const jobs = await Job.findAll({
      where: { companyId: company.id },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'companyName', 'logo', 'website', 'industry']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju oglasa.',
      error: error.message
    });
  }
};

export const archiveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Pronađi oglas
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Oglas nije pronađen.'
      });
    }

    // Provera da li korisnik ima pristup
    if (job.company.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovom oglasu.'
      });
    }

    // Arhiviraj oglas
    await job.update({ isArchived: true });

    return res.status(200).json({
      success: true,
      message: 'Oglas je uspješno arhiviran!',
      data: job
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri arhiviranju oglasa.',
      error: error.message
    });
  }
};