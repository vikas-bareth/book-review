const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const bookController = require("../controllers/book.controller");

router.post("/", userAuth, bookController.createBook);
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:id", bookController.getBookById);

module.exports = router;
