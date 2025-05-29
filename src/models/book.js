const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [50, "Author name cannot be more than 50 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: [1000, "Year must be at least 1000"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// Text index for search functionality
bookSchema.index({ title: "text", author: "text" });

// Static method for search
bookSchema.statics.search = async function (query, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const results = await this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ $text: { $search: query } });

  return {
    results,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

module.exports = mongoose.model("Book", bookSchema);
