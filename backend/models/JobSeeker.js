import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const JobSeeker = sequelize.define(
    'JobSeeker',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resume: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cv_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cv_filename: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cv_uploadedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      education: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
      },
      experience: {
        type: DataTypes.INTEGER,
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
      tableName: 'job_seekers',
      timestamps: true
    }
  );

  return JobSeeker;
};
