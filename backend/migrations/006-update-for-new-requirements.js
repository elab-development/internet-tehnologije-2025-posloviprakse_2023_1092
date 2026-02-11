export async function up(queryInterface, Sequelize) {
  
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


export async function down(queryInterface, Sequelize) {
  

  
  await queryInterface.removeColumn('job_seekers', 'education');
  await queryInterface.removeColumn('job_seekers', 'cv_uploadedAt');
  await queryInterface.removeColumn('job_seekers', 'cv_filename');
  await queryInterface.removeColumn('job_seekers', 'cv_url');

  
  await queryInterface.removeColumn('jobs', 'approvedAt');
  await queryInterface.removeColumn('jobs', 'approvedBy');
  await queryInterface.removeColumn('jobs', 'rejectionReason');
  await queryInterface.removeColumn('jobs', 'approvalStatus');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_approvalStatus"');

  
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

  
  await queryInterface.removeColumn('users', 'passwordResetExpires');
  await queryInterface.removeColumn('users', 'passwordResetToken');
  await queryInterface.removeColumn('users', 'emailVerificationToken');
  await queryInterface.removeColumn('users', 'emailVerified');
}
