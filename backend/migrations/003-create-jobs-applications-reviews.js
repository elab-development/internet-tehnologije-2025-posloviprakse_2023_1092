import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  // Create jobs table
  await queryInterface.createTable('jobs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    jobType: {
      type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'),
      defaultValue: 'Full-time'
    },
    experienceLevel: {
      type: DataTypes.ENUM('Entry', 'Mid', 'Senior'),
      defaultValue: 'Mid'
    },
    requiredSkills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Create applications table
  await queryInterface.createTable('applications', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    jobSeekerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'job_seekers',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('applied', 'reviewing', 'interview', 'rejected', 'accepted'),
      defaultValue: 'applied'
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    appliedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Create reviews table
  await queryInterface.createTable('reviews', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    jobSeekerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'job_seekers',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('reviews');
  await queryInterface.dropTable('applications');
  await queryInterface.dropTable('jobs');
}
