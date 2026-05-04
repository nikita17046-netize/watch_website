const mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    { 
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
      }, 
      quantity: Number, 
      price: Number, 
      total: Number 
    },
  ],
  totalAmount: {
    type: Number,
  },
  totalbill: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "confrom", "shipped", "delivered", "cancel"],
    default: "pending",
  },
  trackingId: {
    type: String,
    default: ""
  },
  courierPartner: {
    type: String,
    default: ""
  },
});

module.exports = mongoose.model("order", OrderSchema);
