const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const reviewController = require("../../../controllers/review.controller");

// Add Review
router.post("/add", userMiddleware.authUser, reviewController.AddReview);

// Get Recent Reviews (Global)
router.get("/recent", reviewController.GetRecentReviews);

// Get Reviews for a Product
router.get("/product/:productId", reviewController.GetProductReviews);

module.exports = router;
