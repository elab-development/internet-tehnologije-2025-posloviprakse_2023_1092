

























































































































































































export const EXAMPLE_QUERIES = {
  
  getUserFull: `
    db.User.findByPk(userId, {
      include: [
        { association: 'JobSeeker', include: ['Applications', 'Reviews'] },
        { association: 'Company', include: ['Jobs', 'Reviews'] }
      ]
    })
  `,

  
  getCompanyWithJobs: `
    db.Company.findByPk(companyId, {
      include: [{
        association: 'Jobs',
        include: ['Applications']
      }]
    })
  `,

  
  getJobWithApplications: `
    db.Job.findByPk(jobId, {
      include: [{
        association: 'Applications',
        include: ['JobSeeker', 'Job']
      }, 'Company']
    })
  `,

  
  searchJobs: `
    db.Job.findAll({
      where: {
        location: 'Beograd',
        category: 'IT'
      },
      include: ['Company']
    })
  `,

  
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
