const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");


// create order
module.exports.CreateOrder = async ({ userId, items }) => {
  let totalAmount = 0;

  let orderItems = [];

  for (let item of items) {
    console.log(item);
    const productId = item.productId;
    const product = await productModel.findOne({ _id: productId });

    if (!product) throw new Error("Product Not Found");

    const itemsTotal = product.price * item.quantity;

    totalAmount += itemsTotal;

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
      total: itemsTotal,
    });
  }

  return await orderModel.create({
    userId,
    items: orderItems,
    totalAmount: totalAmount,
  });
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

// get order history or show order
module.exports.GetOrder = async(userId)=>{
    return await orderModel.findOne({userId});
}
