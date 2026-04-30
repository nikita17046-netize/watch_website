const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
const offerController = require("../../../controllers/offer.controller");
const couponController = require("../../../controllers/coupon.controller");
const productController = require("../../../controllers/product.controller");
const orderController = require("../../../controllers/order.controller");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};

// Dashboard Stats
router.get("/stats", userMiddleware.authUser, isAdmin, adminController.GetDashboardStats);

// User Management
router.get("/users", userMiddleware.authUser, isAdmin, adminController.GetAllUsers);
router.post("/users/toggle-block/:userId", userMiddleware.authUser, isAdmin, adminController.ToggleUserBlock);

// Order Management
router.get("/orders", userMiddleware.authUser, isAdmin, orderController.GetAllOrders);
router.post("/orders/status/:orderId", userMiddleware.authUser, isAdmin, adminController.UpdateOrderStatus);

// Offer Management
router.post("/offers", userMiddleware.authUser, isAdmin, offerController.CreateOffer);
router.get("/offers", userMiddleware.authUser, isAdmin, offerController.GetAllOffers);
router.delete("/offers/:id", userMiddleware.authUser, isAdmin, offerController.DeleteOffer);

// Coupon Management
router.post("/coupons", userMiddleware.authUser, isAdmin, couponController.CreateCoupon);
router.get("/coupons", userMiddleware.authUser, isAdmin, couponController.GetAllCoupons);
router.delete("/coupons/:id", userMiddleware.authUser, isAdmin, couponController.DeleteCoupon);

module.exports = router;
