const cartModel = require("../models/cart.model");

// add item to cart
module.exports.addToCart = async ({ userId, item }) => {
  let cart = await cartModel.findOne({ userId });

  if (!cart) cart = new cartModel({ userId, items: [] });

  cart.items.push(item);
  await cart.save();
  return await cartModel.findOne({ userId }).populate('items.productId');
};

// get Cart
module.exports.GetCart = async (userId) => {
  return await cartModel.findOne({ userId }).populate('items.productId');
};

// delete single product from cart
module.exports.RemoveSingleProduct = async ({ userId, productId, itemId }) => {
  // find login user cart
  let cart = await cartModel.findOne({ userId });

  if (!cart) throw new Error("Cart Not Found !!");

  // find index number of product based on productId OR itemId
  const itemIndex = cart.items.findIndex(
    (i) => {
      // Priority 1: Match by Entry ID (itemId)
      if (itemId && i._id.toString() === itemId.toString()) return true;
      
      // Priority 2: Match by Product ID
      if (!i.productId || !productId) return false;
      const idInCart = i.productId._id ? i.productId._id : i.productId;
      return idInCart.toString() === productId.toString();
    }
  );

  console.log("Attempting to remove. ItemIndex:", itemIndex, "Product:", productId, "Item:", itemId);

  if (itemIndex < 0) {
    throw new Error("Item not Found in your collection");
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();
  return await cartModel.findOne({ userId }).populate('items.productId');
};

module.exports.UpdateQuantity = async ({ userId, productId, quantity }) => {
  let cart = await cartModel.findOne({ userId });
  if (!cart) throw new Error("Cart Not Found !!");

  const itemIndex = cart.items.findIndex(i => {
    const idInCart = i.productId?._id || i.productId;
    return idInCart && idInCart.toString() === productId.toString();
  });
  
  if (itemIndex < 0) throw new Error("Item not Found");

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return await cartModel.findOne({ userId }).populate('items.productId');
};

module.exports.ClearCart = async (userId) => {
  let cart = await cartModel.findOne({ userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return cart;
};
