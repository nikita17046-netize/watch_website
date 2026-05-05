const express = require("express");
const router = express.Router();
const contactModel = require("../../../models/contact.model");
const adminMiddleware = require("../../../middlewares/admin.middleware");
const userMiddleware = require("../../../middlewares/user.middleware");

// Submit Contact Form
router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await contactModel.create({ name, email, subject, message });
    res.status(201).json({ message: "Inquiry received successfully", contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Inquiries (Admin Only)
router.get("/all", userMiddleware.authUser, adminMiddleware.authAdmin, async (req, res) => {
  try {
    const inquiries = await contactModel.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Inquiry Status (Admin Only)
router.patch("/status/:id", userMiddleware.authUser, adminMiddleware.authAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await contactModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: "Status updated", contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
