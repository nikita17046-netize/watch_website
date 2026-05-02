const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const wishlistController = require("../../../controllers/wishlist.controller");

// add into wishlist
router.post(
  "/add",
  userMiddleware.authUser,
  wishlistController.AddToWishlist,
);

// get all items
router.get(
    "/all",
    userMiddleware.authUser,
    wishlistController.GetWishlist,
);

// remove item
router.post(
    "/remove",
    userMiddleware.authUser,
    wishlistController.RemoveFromWishlist,
);

module.exports = router;
