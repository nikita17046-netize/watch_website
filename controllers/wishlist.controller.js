const wishlistService = require("../services/wishlist.service");

module.exports.AddToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const wishlist = await wishlistService.addToWishlist({ userId, productId });
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.GetWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistService.GetWishlist(userId);
    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.RemoveFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const wishlist = await wishlistService.RemoveFromWishlist({ userId, productId });
    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};