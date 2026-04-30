const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const offerModel = require("../models/offer.model");

module.exports.GetDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ role: 'user' });
        const totalProducts = await productModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();
        
        const orders = await orderModel.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Sales for last 6 months (simplified)
        const monthlySales = await orderModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const recentOrders = await orderModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'username email');

        res.status(200).json({
            stats: { totalUsers, totalProducts, totalOrders, totalRevenue },
            monthlySales,
            recentOrders
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.GetAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.ToggleUserBlock = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.UpdateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
