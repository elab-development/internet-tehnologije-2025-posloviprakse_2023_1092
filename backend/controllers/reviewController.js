import db from '../models/index.js';

const Review = db.Review;
const JobSeeker = db.JobSeeker;
const Company = db.Company;

export const createReview = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { rating, comment } = req.body;

    const jobSeeker = await JobSeeker.findOne({ where: { userId: req.user.id } });

    if (!jobSeeker) {
      return res.status(403).json({
        success: false,
        message: 'Samo pretražiatelji poslova mogu dati recenziju.'
      });
    }

    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompanija nije pronađena.'
      });
    }

    
    const existingReview = await Review.findOne({
      where: { companyId, jobSeekerId: jobSeeker.id }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Već ste dali recenziju za ovu kompaniju.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Ocjena mora biti između 1 i 5.'
      });
    }

    const review = await Review.create({
      companyId,
      jobSeekerId: jobSeeker.id,
      rating,
      comment
    });

    return res.status(201).json({
      success: true,
      message: 'Recenzija je uspješno poslana!',
      data: review
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri slanju recenzije.',
      error: error.message
    });
  }
};

export const getCompanyReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Kompanija nije pronađena.'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { companyId },
      include: [{
        model: JobSeeker,
        include: [{
          model: db.User,
          attributes: ['firstName', 'lastName']
        }]
      }],
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const averageRating = rows.length > 0
      ? (rows.reduce((sum, review) => sum + review.rating, 0) / rows.length).toFixed(2)
      : 0;

    return res.status(200).json({
      success: true,
      data: rows,
      averageRating,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri dohvaćanju recenzija.',
      error: error.message
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId, {
      include: [{ model: JobSeeker }]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Recenzija nije pronađena.'
      });
    }

    if (review.JobSeeker.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovoj recenziji.'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Ocjena mora biti između 1 i 5.'
      });
    }

    await review.update({
      rating: rating || review.rating,
      comment: comment || review.comment
    });

    return res.status(200).json({
      success: true,
      message: 'Recenzija je uspješno ažurirana!',
      data: review
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju recenzije.',
      error: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId, {
      include: [{ model: JobSeeker }]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Recenzija nije pronađena.'
      });
    }

    if (review.JobSeeker.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate pristup ovoj recenziji.'
      });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: 'Recenzija je uspješno obrisana!'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Greška pri brisanju recenzije.',
      error: error.message
    });
  }
};
