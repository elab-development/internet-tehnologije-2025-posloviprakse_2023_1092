
export const DATABASE_SCHEMA = {
  
  users: {
    id: 'SERIAL PRIMARY KEY',
    firstName: 'VARCHAR(100) NOT NULL',
    lastName: 'VARCHAR(100) NOT NULL',
    email: 'VARCHAR(100) UNIQUE NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    role: "ENUM('student', 'alumni', 'company', 'admin') DEFAULT 'student'",
    emailVerified: 'BOOLEAN DEFAULT FALSE',
    emailVerificationToken: 'VARCHAR(255)',
    lastLogin: 'TIMESTAMP',
    createdAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },

  
  jobSeekers: {
    id: 'SERIAL PRIMARY KEY',
    userId: 'INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE',
    bio: 'TEXT',
    phone: 'VARCHAR(20)',
    location: 'VARCHAR(100)',
    education: 'JSON',
    skills: 'TEXT[]',
    yearsOfExperience: 'INTEGER',
    cvPath: 'VARCHAR(255)',
    createdAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },

  
  companies: {
    id: 'SERIAL PRIMARY KEY',
    userId: 'INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE',
    companyName: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    industry: 'VARCHAR(100)',
    location: 'VARCHAR(100)',
    website: 'VARCHAR(255)',
    logo: 'VARCHAR(255)',
    createdAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },

  
  jobs: {
    id: 'SERIAL PRIMARY KEY',
    title: 'VARCHAR(255) NOT NULL',
    description: 'TEXT NOT NULL',
    category: 'VARCHAR(50)',
    location: 'VARCHAR(100)',
    jobType: "VARCHAR(50) DEFAULT 'Full-time'",
    experienceLevel: "VARCHAR(50) DEFAULT 'Entry'",
    salary: 'DECIMAL(10,2)',
    requiredSkills: 'TEXT[]',
    deadline: 'DATE',
    companyId: 'INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE',
    applicationCount: 'INTEGER DEFAULT 0',
    createdAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },

  
  applications: {
    id: 'SERIAL PRIMARY KEY',
    jobId: 'INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE',
    jobSeekerId: 'INTEGER NOT NULL REFERENCES jobSeekers(id) ON DELETE CASCADE',
    status: "VARCHAR(50) DEFAULT 'pending'",
    appliedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    reviewed: 'BOOLEAN DEFAULT FALSE',
    feedback: 'TEXT',
    updatedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  },

  
  reviews: {
    id: 'SERIAL PRIMARY KEY',
    companyId: 'INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE',
    jobSeekerId: 'INTEGER NOT NULL REFERENCES jobSeekers(id) ON DELETE CASCADE',
    rating: 'INTEGER CHECK(rating >= 1 AND rating <= 5)',
    comment: 'TEXT',
    createdAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
  }
};


export const DATABASE_RELATIONSHIPS = {
  'users -> jobSeekers': 'One-to-One (student profil)',
  'users -> companies': 'One-to-One (company profil)',
  'companies -> jobs': 'One-to-Many (oglasi)',
  'jobs -> applications': 'One-to-Many (primene)',
  'jobSeekers -> applications': 'One-to-Many (primene)',
  'companies -> reviews': 'One-to-Many (recenzije)',
  'jobSeekers -> reviews': 'One-to-Many (napisane recenzije)'
};


export const DATABASE_CONSTRAINTS = {
  UNIQUE_INDEXES: [
    'users.email',
    'jobSeekers.userId',
    'companies.userId'
  ],
  FOREIGN_KEYS: [
    'jobSeekers.userId -> users.id',
    'companies.userId -> users.id',
    'jobs.companyId -> companies.id',
    'applications.jobId -> jobs.id',
    'applications.jobSeekerId -> jobSeekers.id',
    'reviews.companyId -> companies.id',
    'reviews.jobSeekerId -> jobSeekers.id'
  ],
  CHECK_CONSTRAINTS: [
    'reviews.rating BETWEEN 1 AND 5'
  ]
};


export const DATABASE_ENUMS = {
  USER_ROLES: ['student', 'alumni', 'company', 'admin'],
  JOB_TYPES: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
  EXPERIENCE_LEVELS: ['Entry', 'Mid', 'Senior'],
  APPLICATION_STATUS: ['pending', 'accepted', 'rejected'],
  JOB_CATEGORIES: ['IT', 'Marketing', 'Sales', 'Design', 'HR', 'Finance', 'Engineering', 'Other'],
  RATING_SCALE: [1, 2, 3, 4, 5]
};

export default {
  DATABASE_SCHEMA,
  DATABASE_RELATIONSHIPS,
  DATABASE_CONSTRAINTS,
  DATABASE_ENUMS
};
