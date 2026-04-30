const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const orderController = require("../../../controllers/order.controller");

router.post("/create", userMiddleware.authUser, orderController.CreateOrder);
router.get("/my", userMiddleware.authUser, orderController.GetMyOrders);
router.get("/all", userMiddleware.authUser, orderController.GetAllOrders);
router.post("/update-status", userMiddleware.authUser, orderController.UpdateStatus);

module.exports = router;