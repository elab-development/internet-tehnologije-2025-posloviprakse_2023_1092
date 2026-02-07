import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Job = sequelize.define(
    'Job',
    {
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
        }
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
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    },
    {
      tableName: 'jobs',
      timestamps: true
    }
  );

  return Job;
};
