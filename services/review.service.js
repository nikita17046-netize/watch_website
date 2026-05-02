const reviewModel = require("../models/review.model");

// Add Review
module.exports.AddReview = async ({ productId, userId, rating, comment }) => {
  return await reviewModel.create({ productId, userId, rating, comment });
};

// Get Reviews by Product
module.exports.GetProductReviews = async (productId) => {
  return await reviewModel.find({ productId, status: 'approved' })
    .populate('userId', 'username email')
    .sort({ createdAt: -1 });
};

// Get Recent Reviews (Global)
module.exports.GetRecentReviews = async () => {
  return await reviewModel.find({ status: 'approved' })
    .populate('productId', 'name images')
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
    .limit(6);
};
module.exports.GetAllReviews = async () => {
  return await reviewModel.find()
    .populate('productId', 'name images')
    .populate('userId', 'username')
    .sort({ createdAt: -1 });
};
