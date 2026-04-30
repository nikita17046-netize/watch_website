const cartModel = require("../models/cart.model");
const cartService = require("../services/cart.service");

// Add To Cart
module.exports.AddToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item } = req.body;

    const exist = await cartModel.findOne({ userId });
    
    if (exist) {
      const isDuplicate = exist.items.some(val => val.productId.toString() === item.productId.toString());
      if (isDuplicate) {
        return res.status(400).json({ message: "Product is already in your cart" });
      }
    }

    const cart = await cartService.addToCart({ userId, item });

    return res
      .status(200)
      .json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("AddToCart Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Get Cart
module.exports.GetCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await cartService.GetCart(userId);

    if (!cart) {
      return res.status(404).json("Cart Not Found !!");
    }

    return res
      .status(200)
      .json({ message: "Cart Data Fetch Successfully", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// remove single item from cart
module.exports.RemoveItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, itemId } = req.body;
    console.log("RemoveItem - User:", userId, "Product:", productId, "Item:", itemId);

    const cart = await cartService.RemoveSingleProduct({ userId, productId, itemId });

    return res
      .status(200)
      .json({ message: "Remove Item from Cart Successfully", cart });
  } catch (error) {
    console.error("RemoveItem Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Update quantity
module.exports.UpdateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await cartService.UpdateQuantity({ userId, productId, quantity });

    return res
      .status(200)
      .json({ message: "Quantity updated successfully", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.ClearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await cartService.ClearCart(userId);
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
