const orderService = require("../services/order.service");

// create order
module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const order = await orderService.CreateOrder({ userId, items });

    if (!order) {
      return res.status(404).json("Products not Found");
    }

    return res
      .status(200)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get order deatils and show order stauts
module.exports.GetOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await orderService.GetOrder(userId);

    if (!order) return res.status(404).json({ message: "Order Not Found !!" });

    return res.status(200).json({ message: "Order Fetched Successfully", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.GetMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.GetMyOrders(userId);
    return res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
