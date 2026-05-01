const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const offerModel = require("../models/offer.model");
const faqModel = require("../models/faq.model");


module.exports.GetDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ role: 'user' });
        const totalProducts = await productModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();
        
        const orders = await orderModel.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        const pendingOrders = await orderModel.countDocuments({ status: 'Pending' });
        const deliveredOrders = await orderModel.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await orderModel.countDocuments({ status: 'Cancelled' });
        
        const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

        // Sales for last 7 days
        const salesData = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d %b", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                    date: { $first: "$createdAt" }
                }
            },
            { $sort: { date: 1 } }
        ]);

        const recentOrders = await orderModel.find()
            .sort({ createdAt: -1 })
            .limit(8)
            .populate('userId', 'username email');

        const topProducts = await orderModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.total" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" }
        ]);

        res.status(200).json({
            stats: { 
                totalUsers, 
                totalProducts, 
                totalOrders, 
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                averageOrderValue
            },
            salesData,
            recentOrders,
            topProducts
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

// FAQ Management
module.exports.GetAllFaqs = async (req, res) => {
    try {
        const faqs = await faqModel.find().sort({ order: 1 });
        res.status(200).json(faqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.CreateFaq = async (req, res) => {
    try {
        const { question, answer, category, order } = req.body;
        const faq = await faqModel.create({ question, answer, category, order });
        res.status(201).json({ message: "FAQ created successfully", faq });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.UpdateFaq = async (req, res) => {
    try {
        const { faqId } = req.params;
        const updateData = req.body;
        const faq = await faqModel.findByIdAndUpdate(faqId, updateData, { new: true });
        if (!faq) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json({ message: "FAQ updated successfully", faq });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.DeleteFaq = async (req, res) => {
    try {
        const { faqId } = req.params;
        const faq = await faqModel.findByIdAndDelete(faqId);
        if (!faq) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

