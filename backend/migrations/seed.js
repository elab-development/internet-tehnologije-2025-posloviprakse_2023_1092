import db from '../models/index.js';
import { hashPassword } from '../utils/password.js';

const User = db.User;
const JobSeeker = db.JobSeeker;
const Company = db.Company;
const Job = db.Job;
const Application = db.Application;

export const seedDatabase = async () => {
  try {
    console.log('Seedujemo bazu :D');

    
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { email: 'skale@gmail.com' },
      defaults: {
        firstName: 'Admin',
        lastName: 'Skale',
        email: 'skale@gmail.com',
        password: hashPassword('lozinka123'),
        role: 'admin',
        emailVerified: true
      }
    });

    if (!adminCreated) {
      await adminUser.update({
        firstName: 'Admin',
        lastName: 'Skale',
        password: hashPassword('lozinka123'),
        role: 'admin',
        emailVerified: true
      });
    }

    const testUser1 = await User.findOrCreate({
      where: { email: 'student@test.com' },
      defaults: {
        firstName: 'Marko',
        lastName: 'Marković',
        email: 'student@test.com',
        password: hashPassword('TEST123'),
        role: 'student',
        emailVerified: true
      }
    });

    const testUser2 = await User.findOrCreate({
      where: { email: 'company@test.com' },
      defaults: {
        firstName: 'Tech',
        lastName: 'Company',
        email: 'company@test.com',
        password: hashPassword('TEST123'),
        role: 'company',
        emailVerified: true
      }
    });

    const testUser3 = await User.findOrCreate({
      where: { email: 'alumni@test.com' },
      defaults: {
        firstName: 'Aleksandar',
        lastName: 'Alumni',
        email: 'alumni@test.com',
        password: hashPassword('TEST123'),
        role: 'alumni',
        emailVerified: true
      }
    });

    
    await JobSeeker.findOrCreate({
      where: { userId: testUser1[0].id },
      defaults: {
        phone: '062-123-4567',
        location: 'Beograd',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 1
      }
    });

    
    const company1 = await Company.findOrCreate({
      where: { userId: testUser2[0].id },
      defaults: {
        companyName: 'TechCorp Serbia',
        description: 'Vodeća IT kompanija specijalizovana za web razvoj',
        industry: 'IT',
        location: 'Beograd, Srbija',
        website: 'https://techcorp.rs'
      }
    });

    const company2 = await Company.findOrCreate({
      where: { companyName: 'Globex Solutions' },
      defaults: {
        userId: testUser3[0].id,
        description: 'IT konsalting i razvoj softvera',
        industry: 'IT',
        location: 'Novi Sad, Srbija',
        website: 'https://globex.rs'
      }
    });

    
    const testJobs = [
      {
        companyId: company1[0].id,
        title: 'Junior Frontend Developer',
        description: 'Tražimo junior developera sa znanjem React-a. Idealno za novi e startoj karijere!',
        category: 'IT',
        location: 'Beograd, Srbija',
        jobType: 'Full-time',
        experienceLevel: 'Entry',
        salary: 800,
        requiredSkills: ['React', 'JavaScript', 'CSS'],
        isActive: true
      },
      {
        companyId: company1[0].id,
        title: 'Mid-level Backend Developer',
        description: 'Trebaju nam iskusni backend developer sa znanjem Node.js i Express-a',
        category: 'IT',
        location: 'Beograd, Srbija',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        salary: 1200,
        requiredSkills: ['Node.js', 'Express', 'PostgreSQL'],
        isActive: true
      },
      {
        companyId: company2[0].id,
        title: 'Full Stack Developer',
        description: 'Radite na zanimljivim projektima sa modenim tehnologijama',
        category: 'IT',
        location: 'Novi Sad, Srbija',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        salary: 1500,
        requiredSkills: ['React', 'Node.js', 'TypeScript'],
        isActive: true
      },
      {
        companyId: company1[0].id,
        title: 'Praktikant - Frontend',
        description: 'Pozivamo studente na 3-mesečnu praksu sa mogućnošću zaposlenja',
        category: 'IT',
        location: 'Beograd, Srbija',
        jobType: 'Internship',
        experienceLevel: 'Entry',
        salary: 300,
        requiredSkills: ['HTML', 'CSS', 'JavaScript'],
        isActive: true
      },
      {
        companyId: company2[0].id,
        title: 'Senior Developer',
        description: 'Tražimo seniora sa 5+ godina iskustva za vođenje tima',
        category: 'IT',
        location: 'Novi Sad, Srbija',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: 2000,
        requiredSkills: ['Leadership', 'Architecture', 'Full Stack'],
        isActive: true
      }
    ];

    for (const jobData of testJobs) {
      await Job.findOrCreate({
        where: {
          companyId: jobData.companyId,
          title: jobData.title
        },
        defaults: jobData
      });
    }

    
    const jobSeeker = await JobSeeker.findOne({ where: { userId: testUser1[0].id } });
    const firstJob = await Job.findOne({
      where: { title: 'Junior Frontend Developer', companyId: company1[0].id }
    });

    if (jobSeeker && firstJob) {
      await Application.findOrCreate({
        where: { jobId: firstJob.id, jobSeekerId: jobSeeker.id },
        defaults: {
          jobId: firstJob.id,
          jobSeekerId: jobSeeker.id,
          status: 'reviewing',
          coverLetter: 'Zdravo! Veoma sam motivisan da radim kao frontend developer.'
        }
      });
    }

    console.log('Baza je seed-ovana sa test podacima :D !');
    console.log('\n Test Kredencijali:');
    console.log('  Admin: skale@gmail.com / lozinka123');
    console.log('  Student: student@test.com / TEST123');
    console.log('  Company: company@test.com / TEST123');
    console.log('  Alumni: alumni@test.com / TEST123');
    console.log('\n Dodati oglasi: 5 test oglasa');

  } catch (error) {
    console.error('Greška pri seed-ovanju:', error);
  }
};

export default seedDatabase;
