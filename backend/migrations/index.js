/**
 * MASTER MIGRATIONS INDEX
 * 
 * Sveobuhvatan pregled svih migracija
 * Migracije se primenjuju automatski kroz db.sequelize.sync() u server.js
 * 
 * Redosled primene:
 * 1. 001-create-users.js
 * 2. 002-create-job-seekers-and-companies.js
 * 3. 003-create-jobs-applications-reviews.js
 * 4. 004-add-last-login-to-users.js
 * 5. 005-modify-companies-table.js
 * 6. 006-update-for-new-requirements.js
 */

export const MIGRATIONS = {
  '001-create-users.js': {
    description: 'Kreira tabelu users sa osnovnim poljima',
    created_tables: ['users'],
    fields: [
      'id (UUID PK)',
      'firstName (VARCHAR)',
      'lastName (VARCHAR)',
      'email (VARCHAR UNIQUE)',
      'password (VARCHAR)',
      'role (ENUM)',
      'profilePicture (VARCHAR)',
      'isActive (BOOLEAN)',
      'createdAt (TIMESTAMP)',
      'updatedAt (TIMESTAMP)'
    ]
  },

  '002-create-job-seekers-and-companies.js': {
    description: 'Kreira tabele za job seekers i companies sa njihovim podacima',
    created_tables: ['jobSeekers', 'companies'],
    jobSeekers_fields: [
      'id (UUID PK)',
      'userId (FK -> users)',
      'bio (TEXT)',
      'phone (VARCHAR)',
      'location (VARCHAR)',
      'resume (VARCHAR path)',
      'skills (ARRAY)',
      'experience (INTEGER years)',
      'createdAt (TIMESTAMP)',
      'updatedAt (TIMESTAMP)'
    ],
    companies_fields: [
      'id (UUID PK)',
      'userId (FK -> users)',
      'companyName (VARCHAR)',
      'description (TEXT)',
      'industry (VARCHAR)',
      'location (VARCHAR)',
      'website (VARCHAR)',
      'logo (VARCHAR)',
      'createdAt (TIMESTAMP)',
      'updatedAt (TIMESTAMP)'
    ]
  },

  '003-create-jobs-applications-reviews.js': {
    description: 'Kreira tabele za jobs, applications i reviews',
    created_tables: ['jobs', 'applications', 'reviews'],
    jobs_fields: [
      'id (UUID PK)',
      'title (VARCHAR)',
      'description (TEXT)',
      'location (VARCHAR)',
      'jobType (VARCHAR)',
      'salary (DECIMAL)',
      'companyId (FK -> companies)',
      'createdAt (TIMESTAMP)',
      'updatedAt (TIMESTAMP)'
    ],
    applications_fields: [
      'id (UUID PK)',
      'jobId (FK -> jobs)',
      'jobSeekerId (FK -> jobSeekers)',
      'status (VARCHAR: pending/accepted/rejected)',
      'appliedAt (TIMESTAMP)',
      'createdAt (TIMESTAMP)',
      'updatedAt (TIMESTAMP)'
    ],
    reviews_fields: [
      'id (UUID PK)',
      'companyId (FK -> companies)',
      'jobSeekerId (FK -> jobSeekers)',
      'rating (INTEGER 1-5)',
      'comment (TEXT)',
      'createdAt (TIMESTAMP)',
      'updatedAt (TIMESTAMP)'
    ]
  },

  '004-add-last-login-to-users.js': {
    description: 'Dodaje lastLogin polje u users tabelu',
    modified_tables: ['users'],
    changes: [
      'ADD COLUMN lastLogin TIMESTAMP (nullable)'
    ]
  },

  '005-modify-companies-table.js': {
    description: 'Menja companies tabelu sa novim poljima',
    modified_tables: ['companies'],
    changes: [
      'Ažurira kolone za fleksibilnost'
    ]
  },

  '006-update-for-new-requirements.js': {
    description: 'Dodaje nove kolone za nove zahteve',
    modified_tables: ['jobs', 'users', 'jobSeekers'],
    changes: [
      'Dodaje polja prema novim zahtevima'
    ]
  }
};

/**
 * KAKO KORISTITI MIGRACIJE
 * 
 * 1. Automatski (preporučeno):
 *    // U server.js - migracije se primenjuju automatski
 *    db.sequelize.sync({ alter: false })
 * 
 * 2. Ručno (ako koristiš Sequelize CLI):
 *    // Sve migracije
 *    npx sequelize-cli db:migrate
 *    
 *    // Nazad (undo)
 *    npx sequelize-cli db:migrate:undo:all
 * 
 * 3. Provera stanja:
 *    // Sinhronizovani su modeli sa bazom tokom startanja server-a
 */

export const MIGRATION_COMMANDS = {
  runAll: 'npx sequelize-cli db:migrate',
  undoLast: 'npx sequelize-cli db:migrate:undo',
  undoAll: 'npx sequelize-cli db:migrate:undo:all',
  seed: 'npx sequelize-cli db:seed:all',
  undoSeed: 'npx sequelize-cli db:seed:undo:all'
};

/**
 * CURRENT DATABASE STATE (nakon svih migracija)
 * 
 * Tabele:
 *  - users (korisnici - student, alumni, company, admin)
 *  - jobSeekers (profili studenata/alumni)
 *  - companies (profili kompanija)
 *  - jobs (oglasi za posao)
 *  - applications (primene studenata za poslove)
 *  - reviews (recenzije kompanija)
 * 
 * Ukupno polja: 60+
 * Veza (associations): 15+
 * Constraints: 10+
 */

export default MIGRATIONS;
