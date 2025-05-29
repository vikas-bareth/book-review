const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const bookController = require("../controllers/book.controller");
const requireAdmin = require("../middlewares/admin");

router.post("/", userAuth, bookController.createBook);
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:id", bookController.getBookById);
router.delete("/:id", userAuth, requireAdmin, bookController.deleteBook);

module.exports = router;
