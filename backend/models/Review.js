import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Review = sequelize.define(
    'Review',
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
      jobSeekerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'job_seekers',
          key: 'id'
        }
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
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
    },
    {
      tableName: 'reviews',
      timestamps: true
    }
  );

  return Review;
};
