const orderModel = require("../models/order.model");

// create order
module.exports.createOrder = async ({ userId, items, totalAmount, shippingAddress, paymentMethod }) => {
  try {
    const order = new orderModel({
      userId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price || 0),
        total: Number(item.price || 0) * item.quantity
      })),
      totalAmount: Number(totalAmount),
      shippingAddress,
      paymentMethod,
      status: 'Pending'
    });
    
    const savedOrder = await order.save();
    return await orderModel.findById(savedOrder._id).populate('items.productId');
  } catch (error) {
    console.error("Order Service Error:", error.message);
    throw error;
  }
};

// get user orders
module.exports.GetMyOrders = async (userId) => {
  return await orderModel.find({ userId }).populate('items.productId').sort({ createdAt: -1 });
};

// get all orders (Admin) - OPTIMIZED: Removed heavy items.productId populate for list view
module.exports.GetAllOrders = async () => {
  return await orderModel.find().populate('userId', 'username email').sort({ createdAt: -1 });
};

// get single order details (Admin)
module.exports.GetOrderById = async (orderId) => {
  return await orderModel.findById(orderId).populate('userId', 'username email').populate('items.productId');
};

// update order status
module.exports.UpdateOrderStatus = async (orderId, status) => {
  return await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
};