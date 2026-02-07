import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Application = sequelize.define(
    'Application',
    {
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
        }
      },
      jobSeekerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'job_seekers',
          key: 'id'
        }
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
    },
    {
      tableName: 'applications',
      timestamps: true
    }
  );

  return Application;
};
