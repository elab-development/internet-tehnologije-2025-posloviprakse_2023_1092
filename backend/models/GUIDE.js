/**
 * MASTER MODELS GUIDE
 * 
 * Svi modeli su automatski učitani i dostupni kroz db objekat
 * Import: import db from '../models/index.js'
 * 
 * Dostupni modeli:
 * - db.User
 * - db.JobSeeker
 * - db.Company
 * - db.Job
 * - db.Application
 * - db.Review
 */

// ==================== USER MODEL ====================
/**
 * db.User
 * 
 * Polja:
 *  - id (SERIAL PK)
 *  - firstName (VARCHAR)
 *  - lastName (VARCHAR)
 *  - email (VARCHAR UNIQUE)
 *  - password (VARCHAR hashed)
 *  - role (ENUM: student, alumni, company, admin)
 *  - emailVerified (BOOLEAN)
 *  - emailVerificationToken (VARCHAR)
 *  - lastLogin (TIMESTAMP)
 * 
 * Relacije:
 *  - hasOne JobSeeker (student/alumni profil)
 *  - hasOne Company (company profil)
 * 
 * Primer:
 *  const user = await db.User.findByPk(1);
 *  const jobSeeker = await user.getJobSeeker();
 *  const company = await user.getCompany();
 */

// ==================== JOB SEEKER MODEL ====================
/**
 * db.JobSeeker
 * 
 * Polja:
 *  - id (SERIAL PK)
 *  - userId (FK -> users)
 *  - bio (TEXT)
 *  - phone (VARCHAR)
 *  - location (VARCHAR)
 *  - education (JSON)
 *  - skills (ARRAY of strings)
 *  - yearsOfExperience (INTEGER)
 *  - cvPath (VARCHAR)
 * 
 * Relacije:
 *  - belongsTo User
 *  - hasMany Application
 *  - hasMany Review
 * 
 * Primer:
 *  const seeker = await db.JobSeeker.findByPk(1, {
 *    include: ['user', 'applications', 'reviews']
 *  });
 */

// ==================== COMPANY MODEL ====================
/**
 * db.Company
 * 
 * Polja:
 *  - id (SERIAL PK)
 *  - userId (FK -> users)
 *  - companyName (VARCHAR)
 *  - description (TEXT)
 *  - industry (VARCHAR)
 *  - location (VARCHAR)
 *  - website (VARCHAR)
 *  - logo (VARCHAR path)
 * 
 * Relacije:
 *  - belongsTo User
 *  - hasMany Job
 *  - hasMany Review
 * 
 * Primer:
 *  const company = await db.Company.findByPk(1, {
 *    include: [{
 *      association: 'jobs',
 *      include: ['applications']
 *    }]
 *  });
 */

// ==================== JOB MODEL ====================
/**
 * db.Job
 * 
 * Polja:
 *  - id (SERIAL PK)
 *  - title (VARCHAR)
 *  - description (TEXT)
 *  - category (VARCHAR: IT, Marketing, Sales, Design, HR, Finance, Engineering, Other)
 *  - location (VARCHAR)
 *  - jobType (VARCHAR: Full-time, Part-time, Contract, Temporary, Internship)
 *  - experienceLevel (VARCHAR: Entry, Mid, Senior)
 *  - salary (DECIMAL)
 *  - requiredSkills (ARRAY)
 *  - deadline (DATE)
 *  - companyId (FK -> companies)
 *  - applicationCount (INTEGER)
 * 
 * Relacije:
 *  - belongsTo Company (as 'company')
 *  - hasMany Application
 * 
 * Primer:
 *  const job = await db.Job.findByPk(1, {
 *    include: ['company', 'applications']
 *  });
 *  
 *  const jobs = await db.Job.findAll({
 *    where: { location: 'Beograd' },
 *    include: ['company']
 *  });
 */

// ==================== APPLICATION MODEL ====================
/**
 * db.Application
 * 
 * Polja:
 *  - id (SERIAL PK)
 *  - jobId (FK -> jobs)
 *  - jobSeekerId (FK -> jobSeekers)
 *  - status (VARCHAR: pending, accepted, rejected)
 *  - appliedAt (TIMESTAMP)
 *  - reviewed (BOOLEAN)
 *  - feedback (TEXT)
 * 
 * Relacije:
 *  - belongsTo Job
 *  - belongsTo JobSeeker
 * 
 * Primer:
 *  const app = await db.Application.findByPk(1, {
 *    include: ['job', 'jobSeeker']
 *  });
 *  
 *  const myApplications = await db.Application.findAll({
 *    where: { jobSeekerId: 5 },
 *    include: [{
 *      association: 'job',
 *      include: ['company']
 *    }]
 *  });
 */

// ==================== REVIEW MODEL ====================
/**
 * db.Review
 * 
 * Polja:
 *  - id (SERIAL PK)
 *  - companyId (FK -> companies)
 *  - jobSeekerId (FK -> jobSeekers)
 *  - rating (INTEGER: 1-5)
 *  - comment (TEXT)
 *  - createdAt (TIMESTAMP)
 * 
 * Relacije:
 *  - belongsTo Company
 *  - belongsTo JobSeeker
 * 
 * Primer:
 *  const review = await db.Review.findByPk(1, {
 *    include: ['company', 'jobSeeker']
 *  });
 *  
 *  const companyReviews = await db.Review.findAll({
 *    where: { companyId: 3 },
 *    attributes: ['rating', 'comment', 'createdAt']
 *  });
 */

// ==================== COMMON QUERIES ====================
export const EXAMPLE_QUERIES = {
  // Get user sa svim podacima
  getUserFull: `
    db.User.findByPk(userId, {
      include: [
        { association: 'JobSeeker', include: ['Applications', 'Reviews'] },
        { association: 'Company', include: ['Jobs', 'Reviews'] }
      ]
    })
  `,

  // Get company sa svim oglasima
  getCompanyWithJobs: `
    db.Company.findByPk(companyId, {
      include: [{
        association: 'Jobs',
        include: ['Applications']
      }]
    })
  `,

  // Get job sa svim primenama
  getJobWithApplications: `
    db.Job.findByPk(jobId, {
      include: [{
        association: 'Applications',
        include: ['JobSeeker', 'Job']
      }, 'Company']
    })
  `,

  // Search all jobs by location and category
  searchJobs: `
    db.Job.findAll({
      where: {
        location: 'Beograd',
        category: 'IT'
      },
      include: ['Company']
    })
  `,

  // Get student applications
  getStudentApplications: `
    db.JobSeeker.findByPk(seekerId, {
      include: [{
        association: 'Applications',
        include: [{
          association: 'Job',
          include: ['Company']
        }]
      }]
    })
  `
};

// ==================== DATABASE SYNC ====================
/**
 * Automatsko sinhronizovanje baze
 * 
 * U server.js:
 *  db.sequelize.sync({ alter: false })
 *    .then(() => console.log('Database synchronized!'))
 *    .catch(err => console.error('DB sync failed:', err));
 */

export default {
  EXAMPLE_QUERIES,
  MODELS: {
    User: 'db.User',
    JobSeeker: 'db.JobSeeker',
    Company: 'db.Company',
    Job: 'db.Job',
    Application: 'db.Application',
    Review: 'db.Review'
  }
};
