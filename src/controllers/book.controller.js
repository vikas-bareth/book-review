const ApiError = require("../utils/ApiError");
const Book = require("../models/book");
const Review = require("../models/review");

exports.createBook = async (req, res, next) => {
  try {
    const { title, author, genre, publishedYear, description } = req.body;

    if (!title || !author || !genre) {
      throw new ApiError(400, "Title, author, and genre are required");
    }

    const book = await Book.create({
      title,
      author,
      genre,
      publishedYear,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (genre) filter.genre = new RegExp(genre, "i");

    const [books, total] = await Promise.all([
      Book.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Book.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: books,
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

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    const reviews = await Review.find({ bookId: book._id })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...book.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.searchBooks = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      throw new ApiError(400, "Search query is required");
    }

    const { results, total, pages } = await Book.search(q, page, limit);

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        total,
        pages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    await Review.deleteMany({ bookId: book._id });

    await Book.deleteOne({ _id: book._id });

    res.status(200).json({
      success: true,
      data: null,
      message: "Book and all its reviews deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
