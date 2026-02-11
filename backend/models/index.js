import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import databaseConfig from '../config/database.js';

import UserModel from './User.js';
import JobSeekerModel from './JobSeeker.js';
import CompanyModel from './Company.js';
import JobModel from './Job.js';
import ApplicationModel from './Application.js';
import ReviewModel from './Review.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

console.log(`🔍 Loading Sequelize config for: ${env}`);

let sequelize;
if (config.use_env_variable) {
  
  const dbUrl = process.env[config.use_env_variable];
  
  if (!dbUrl) {
    console.error(`❌ ERROR: ${config.use_env_variable} is not set!`);
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DB') || k.includes('DATABASE')));
    throw new Error(`Missing required environment variable: ${config.use_env_variable}`);
  }
  
  const maskedUrl = dbUrl.replace(/:[^:]*@/, ':***@');
  console.log('🔗 Using DATABASE_URL:', maskedUrl);
  console.log('🔐 Applying SSL config: require=true, rejectUnauthorized=false');
  
  try {
    sequelize = new Sequelize(dbUrl, config);
    console.log('✅ Sequelize instance created successfully');
  } catch (initError) {
    console.error('❌ Failed to create Sequelize instance:', initError.message);
    throw initError;
  }
} else {
  
  console.log(`🔗 Using DB params: ${config.host}:${config.port}/${config.database}`);
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {};


db.User = UserModel(sequelize);
db.JobSeeker = JobSeekerModel(sequelize);
db.Company = CompanyModel(sequelize);
db.Job = JobModel(sequelize);
db.Application = ApplicationModel(sequelize);
db.Review = ReviewModel(sequelize);



db.User.hasOne(db.JobSeeker, { foreignKey: 'userId', as: 'jobSeeker', onDelete: 'CASCADE' });
db.User.hasOne(db.Company, { foreignKey: 'userId', as: 'company', onDelete: 'CASCADE' });


db.JobSeeker.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.JobSeeker.hasMany(db.Application, { foreignKey: 'jobSeekerId', onDelete: 'CASCADE' });
db.JobSeeker.hasMany(db.Review, { foreignKey: 'jobSeekerId', onDelete: 'CASCADE' });


db.Company.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.Company.hasMany(db.Job, { foreignKey: 'companyId', onDelete: 'CASCADE' });
db.Company.hasMany(db.Review, { foreignKey: 'companyId', onDelete: 'CASCADE' });


db.Job.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });
db.Job.hasMany(db.Application, { foreignKey: 'jobId', onDelete: 'CASCADE' });


db.Application.belongsTo(db.Job, { foreignKey: 'jobId', as: 'job' });
db.Application.belongsTo(db.JobSeeker, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });


db.Review.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });
db.Review.belongsTo(db.JobSeeker, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
