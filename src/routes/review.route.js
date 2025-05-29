const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const userAuth = require("../middlewares/auth");

router.post("/books/:id/reviews", userAuth, reviewController.addReview);
router.put("/reviews/:id", userAuth, reviewController.updateReview);
router.delete("/reviews/:id", userAuth, reviewController.deleteReview);
router.get("/reviews/me", userAuth, reviewController.getMyReviews);

module.exports = router;
