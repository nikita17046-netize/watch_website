const reviewService = require("../services/review.service");
const orderModel = require("../models/order.model");

module.exports.AddReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    // Verify Purchase: Check if user has a delivered order containing this product
    const purchased = await orderModel.findOne({
      userId: userId,
      status: "delivered",
      "items.productId": productId
    });

    if (!purchased) {
      return res.status(403).json({ 
        message: "Experience Verification Required. Reviews are reserved for verified acquisitions of this masterpiece." 
      });
    }

    const review = await reviewService.AddReview({ productId, userId, rating, comment });

    return res.status(201).json({ message: "Review shared successfully", review });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.GetProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.GetProductReviews(productId);

    return res.status(200).json({ message: "Reviews fetched successfully", reviews });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.GetRecentReviews = async (req, res) => {
  try {
    const reviews = await reviewService.GetRecentReviews();
    return res.status(200).json({ message: "Recent reviews fetched", reviews });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
