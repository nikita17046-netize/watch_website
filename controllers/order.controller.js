const orderService = require("../services/order.service");

module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const order = await orderService.createOrder({ userId, items, totalAmount, shippingAddress, paymentMethod });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.GetMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.GetMyOrders(userId);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.GetAllOrders = async (req, res) => {
  try {
    const orders = await orderService.GetAllOrders();
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.UpdateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderService.UpdateOrderStatus(orderId, status);
    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
