const wishlistModel = require("../models/wishlist.model");

// add item to wishlist
module.exports.addToWishlist = async ({ userId, productId }) => {
  let wishlist = await wishlistModel.findOne({ userId });

  if (!wishlist) {
    wishlist = new wishlistModel({ userId, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }
  
  return await wishlistModel.findOne({ userId }).populate('products');
};

// get Wishlist
module.exports.GetWishlist = async (userId) => {
  return await wishlistModel.findOne({ userId }).populate('products');
};

// remove single item from wishlist
module.exports.RemoveFromWishlist = async ({ userId, productId }) => {
  let wishlist = await wishlistModel.findOne({ userId });
  if (!wishlist) throw new Error("Wishlist Not Found !!");

  wishlist.products = wishlist.products.filter(p => p.toString() !== productId.toString());
  await wishlist.save();
  
  return await wishlistModel.findOne({ userId }).populate('products');
};