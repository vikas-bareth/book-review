const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      maxlength: [1000, "Review cannot be more than 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Prevent duplicate reviews from the same user for the same book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Static method to get average rating for a book
reviewSchema.statics.getAverageRating = async function (bookId) {
  const result = await this.aggregate([
    {
      $match: { bookId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model("Book").findByIdAndUpdate(bookId, {
      averageRating: result[0]?.averageRating || 0,
      reviewCount: result[0]?.reviewCount || 0,
    });
  } catch (err) {
    throw new ApiError(500, "Failed to update book rating");
  }
};

// Update book rating after saving a review
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bookId);
});

// Update book rating after removing a review
reviewSchema.post("remove", function () {
  this.constructor.getAverageRating(this.bookId);
});

module.exports = mongoose.model("Review", reviewSchema);
