const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const wishlistController = require("../../../controllers/wishlist.controller");

router.post("/add", userMiddleware.authUser, wishlistController.AddToWishlist);
router.get("/all", userMiddleware.authUser, wishlistController.GetWishlist);
router.post("/remove", userMiddleware.authUser, wishlistController.RemoveFromWishlist);

module.exports = router;
