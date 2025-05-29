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

module.exports = mongoose.model("Review", reviewSchema);
