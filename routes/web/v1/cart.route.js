const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const cartController = require("../../../controllers/cart.controller");

// add items
router.post("/add", userMiddleware.authUser, cartController.AddToCart);

// get all items
router.get("/all", userMiddleware.authUser, cartController.GetCart)

// remove single item from cart
router.post("/remove", userMiddleware.authUser, cartController.RemoveItem)

// update quantity
router.post("/update", userMiddleware.authUser, cartController.UpdateQuantity)

// clear cart
router.post("/clear", userMiddleware.authUser, cartController.ClearCart)

module.exports = router;
