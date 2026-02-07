export async function up(queryInterface, Sequelize) {
  // 1. Update users table - add email verification and password reset fields
  await queryInterface.addColumn('users', 'emailVerified', {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  });

  await queryInterface.addColumn('users', 'emailVerificationToken', {
    type: Sequelize.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('users', 'passwordResetToken', {
    type: Sequelize.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('users', 'passwordResetExpires', {
    type: Sequelize.DATE,
    allowNull: true
  });

  // 2. Update role enum to new values: student, alumni, company, admin
  // Note: PostgreSQL requires dropping and recreating enum types
  await queryInterface.sequelize.query(`
    ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50);
    DROP TYPE IF EXISTS "enum_users_role";
    CREATE TYPE "enum_users_role" AS ENUM ('student', 'alumni', 'company', 'admin');
    ALTER TABLE users ALTER COLUMN role TYPE "enum_users_role" USING (
      CASE 
        WHEN role = 'job_seeker' THEN 'student'::VARCHAR
        WHEN role = 'employer' THEN 'company'::VARCHAR
        ELSE role::VARCHAR
      END
    )::"enum_users_role";
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student'::"enum_users_role";
  `);

  // 3. Update jobs table - add approval workflow fields
  await queryInterface.addColumn('jobs', 'approvalStatus', {
    type: Sequelize.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  });

  await queryInterface.addColumn('jobs', 'rejectionReason', {
    type: Sequelize.TEXT,
    allowNull: true
  });

  await queryInterface.addColumn('jobs', 'approvedBy', {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  await queryInterface.addColumn('jobs', 'approvedAt', {
    type: Sequelize.DATE,
    allowNull: true
  });

  // 4. Update job_seekers table - add CV upload and education fields
  await queryInterface.addColumn('job_seekers', 'cv_url', {
    type: Sequelize.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('job_seekers', 'cv_filename', {
    type: Sequelize.STRING,
    allowNull: true
  });

  await queryInterface.addColumn('job_seekers', 'cv_uploadedAt', {
    type: Sequelize.DATE,
    allowNull: true
  });

  await queryInterface.addColumn('job_seekers', 'education', {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: []
  });
}

// eslint-disable-next-line no-unused-vars
export async function down(queryInterface, Sequelize) {
  // Reverse changes in opposite order

  // Remove job_seekers columns
  await queryInterface.removeColumn('job_seekers', 'education');
  await queryInterface.removeColumn('job_seekers', 'cv_uploadedAt');
  await queryInterface.removeColumn('job_seekers', 'cv_filename');
  await queryInterface.removeColumn('job_seekers', 'cv_url');

  // Remove jobs approval workflow columns
  await queryInterface.removeColumn('jobs', 'approvedAt');
  await queryInterface.removeColumn('jobs', 'approvedBy');
  await queryInterface.removeColumn('jobs', 'rejectionReason');
  await queryInterface.removeColumn('jobs', 'approvalStatus');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_approvalStatus"');

  // Revert users role enum to old values
  await queryInterface.sequelize.query(`
    ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
    ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50);
    DROP TYPE IF EXISTS "enum_users_role";
    CREATE TYPE "enum_users_role" AS ENUM ('job_seeker', 'employer', 'admin');
    ALTER TABLE users ALTER COLUMN role TYPE "enum_users_role" USING (
      CASE 
        WHEN role = 'student' THEN 'job_seeker'::VARCHAR
        WHEN role = 'alumni' THEN 'job_seeker'::VARCHAR
        WHEN role = 'company' THEN 'employer'::VARCHAR
        ELSE role::VARCHAR
      END
    )::"enum_users_role";
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'job_seeker'::"enum_users_role";
  `);

  // Remove users email and password reset columns
  await queryInterface.removeColumn('users', 'passwordResetExpires');
  await queryInterface.removeColumn('users', 'passwordResetToken');
  await queryInterface.removeColumn('users', 'emailVerificationToken');
  await queryInterface.removeColumn('users', 'emailVerified');
}
