const ApiError = require("../utils/ApiError");
const Book = require("../models/book");
const Review = require("../models/review");

exports.addReview = async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    const { id: bookId } = req.params;

    if (!rating || !reviewText) {
      throw new ApiError(400, "Rating and review text are required");
    }

    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(401, "Book not found");
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user.id,
    });

    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this book");
    }

    const review = await Review.create({
      bookId,
      userId: req.user.id,
      rating,
      reviewText,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    const { id: reviewId } = req.params;

    if (!rating && !reviewText) {
      throw new ApiError(400, "At least one field to update is required");
    }

    const review = await Review.findOne({
      _id: reviewId,
      userId: req.user.id,
    });

    if (!review) {
      throw new ApiError(404, "Review not found or you are not authorized!");
    }

    if (rating) review.rating = rating;
    if (reviewText) review.reviewText = reviewText;

    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      userId: req.user.id,
    });

    if (!review) {
      throw new ApiError(404, "Review not found or you are not authorized");
    }

    res.status(200).json({
      success: true,
      data: null,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ userId: req.user.id })
        .populate({
          path: "bookId",
          select: "title author",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ userId: req.user.id }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
