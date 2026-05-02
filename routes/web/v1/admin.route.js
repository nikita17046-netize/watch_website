const express = require("express");
const router = express.Router();
const middleware = require("../../../middlewares/admin.middleware");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
const { body } = require("express-validator");

// show all users
// login user --> check user is Admin? --> show all users
router.get(
  "/all/user",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllUser,
);

// Get Dashboard Stats
router.get(
  "/stats",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.GetDashboardStats
);

// Get All Users (for the clients tab)
router.get(
  "/users",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllUser
);

// Get All Orders
router.get(
  "/orders",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.GetAllOrders
);

// Update Order Status
router.post(
  "/orders/status/:orderId",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.UpdateOrderStatus
);

// Delete User
router.delete(
  "/user/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.deleteUser,
);

// update role -- create manager
// router -- service -- controller -- call into router
router.put(
  "/user/:id/role",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.updateUserRole,
);

// FAQ Management
router.get("/faqs", adminController.GetAllFaqs);
router.post("/faqs", usermiddleware.authUser, middleware.authAdmin, adminController.CreateFaq);
router.patch("/faqs/:faqId", usermiddleware.authUser, middleware.authAdmin, adminController.UpdateFaq);
router.delete("/faqs/:faqId", usermiddleware.authUser, middleware.authAdmin, adminController.DeleteFaq);

module.exports = router;

