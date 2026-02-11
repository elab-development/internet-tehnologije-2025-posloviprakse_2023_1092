import db from '../models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteFile } from '../middleware/fileUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Company = db.Company;
const User = db.User;

export const getMyCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'profilePicture'] }]
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompanija nije pronađena.'
      });
    }

    return res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju profila kompanije.',
      error: error.message
    });
  }
};

export const getCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findByPk(companyId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: db.Job,
          attributes: ['id', 'title', 'location', 'jobType'],
          where: { isActive: true },
          required: false
        },
        {
          model: db.Review,
          attributes: ['id', 'rating', 'comment'],
          required: false
        }
      ]
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompanija nije pronađena.'
      });
    }

    const averageRating = company.Reviews && company.Reviews.length > 0
      ? (company.Reviews.reduce((sum, review) => sum + review.rating, 0) / company.Reviews.length).toFixed(2)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        ...company.toJSON(),
        averageRating,
        jobsCount: company.Jobs ? company.Jobs.length : 0,
        reviewsCount: company.Reviews ? company.Reviews.length : 0
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju profila kompanije.',
      error: error.message
    });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ where: { userId: req.user.id } });

    if (!company) {
      return res.status(403).json({
        success: false,
        message: 'Nemate kompanijski profil.'
      });
    }

    const {
      companyName,
      description,
      website,
      industry,
      location,
      employees,
      logo,
      firstName,
      lastName
    } = req.body;

    await company.update({
      companyName: companyName || company.companyName,
      description: description || company.description,
      website: website || company.website,
      industry: industry || company.industry,
      location: location || company.location,
      employees: employees || company.employees,
      logo: logo || company.logo
    });

    const user = await User.findByPk(req.user.id);
    if (user) {
      const userUpdateData = {};
      if (firstName !== undefined) userUpdateData.firstName = firstName;
      if (lastName !== undefined) userUpdateData.lastName = lastName;
      if (Object.keys(userUpdateData).length > 0) {
        await user.update(userUpdateData);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profil kompanije je uspješno ažuriran!',
      data: {
        ...company.toJSON(),
        user: user
          ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              profilePicture: user.profilePicture
            }
          : undefined
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju profila kompanije.',
      error: error.message
    });
  }
};

export const uploadCompanyLogo = async (req, res) => {
  try {
    console.log('🏢 Company logo upload started for company:', req.user.id);

    if (!req.file) {
      console.log('❌ No file provided for logo');
      return res.status(400).json({
        success: false,
        message: 'Niste priložili logo.'
      });
    }

    console.log('📦 File received:', {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const company = await Company.findOne({ where: { userId: req.user.id } });

    if (!company) {
      console.log('❌ Company not found for user:', req.user.id);
      return res.status(403).json({
        success: false,
        message: 'Nemate kompanijski profil.'
      });
    }

    
    if (company.logo && company.logo.startsWith('/uploads/')) {
      console.log('🗑️ Attempting to delete old logo...');
      const oldPath = path.join(__dirname, '..', company.logo);
      deleteFile(oldPath);
    }

    
    let logoValue;
    
    
    if (req.file && req.file.filename) {
      logoValue = `/uploads/profile-pictures/${req.file.filename}`;
      console.log('✅ Using file system path:', logoValue);
    } else if (req.file && req.file.buffer) {
      
      const base64 = req.file.buffer.toString('base64');
      logoValue = `data:${req.file.mimetype};base64,${base64}`;
      console.log('📝 Using Base64 encoded image (size:', base64.length, 'chars)');
    } else {
      console.log('❌ Invalid file object');
      return res.status(400).json({
        success: false,
        message: 'Greška pri procesiranju logo-a.'
      });
    }

    console.log('💾 Updating company logo in database...');
    await company.update({ logo: logoValue });

    console.log('✅ Company logo upload successful');

    return res.status(200).json({
      success: true,
      message: 'Logo kompanije uspešno ažuriran.',
      data: { logo: logoValue }
    });
  } catch (error) {
    console.error('❌ Upload company logo error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Greška pri uploadu logo-a.',
      error: error.message
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const { industry, location, page = 1, limit = 10 } = req.query;

    const where = {};
    if (industry) where.industry = industry;
    if (location) where.location = location;

    const offset = (page - 1) * limit;

    const { count, rows } = await Company.findAndCountAll({
      where,
      include: [
        {
          model: db.Job,
          attributes: ['id'],
          where: { isActive: true },
          required: false
        }
      ],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const companies = rows.map(company => ({
      ...company.toJSON(),
      activeJobsCount: company.Jobs ? company.Jobs.length : 0
    }));

    return res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju kompanija.',
      error: error.message
    });
  }
};
