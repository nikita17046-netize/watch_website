const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const offerModel = require("../models/offer.model");
const faqModel = require("../models/faq.model");
const adminService = require("../services/admin.service");
const cartModel = require("../models/cart.model");
const wishlistModel = require("../models/wishlist.model");
const mongoose = require("mongoose");

module.exports.GetDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ role: 'user' });
        const totalProducts = await productModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();
        const orders = await orderModel.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || order.totalbill || 0), 0);
        const pendingOrders = await orderModel.countDocuments({ status: 'Pending' });
        const deliveredOrders = await orderModel.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await orderModel.countDocuments({ status: 'Cancelled' });
        const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({ _id: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), total: 0, date: date });
        }
        const actualSales = await orderModel.aggregate([{ $match: { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } }, { $group: { _id: { $dateToString: { format: "%d %b", date: "$createdAt" } }, total: { $sum: { $add: [{ $ifNull: ["$totalAmount", 0] }, { $ifNull: ["$totalbill", 0] }] } } } }]);
        const salesData = days.map(day => { const match = actualSales.find(s => s._id === day._id); return match ? { ...day, total: match.total } : day; });
        const recentOrders = await orderModel.find().sort({ createdAt: -1 }).limit(8).populate('userId', 'username email');
        const topProducts = await orderModel.aggregate([{ $unwind: "$items" }, { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.total" } } }, { $sort: { totalSold: -1 } }, { $limit: 5 }, { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productInfo" } }, { $unwind: "$productInfo" }]);
        res.status(200).json({ stats: { totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders, deliveredOrders, cancelledOrders, averageOrderValue }, salesData, recentOrders, topProducts });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.AllUser = async (req, res) => {
    try {
        console.log('[DEBUG] Starting AllUser retrieval...');
        const [users, allOrders, allCarts, allWishlists] = await Promise.all([
            userModel.find({}).lean(),
            orderModel.find({}).lean(),
            cartModel.find({}).lean(),
            wishlistModel.find({}).lean()
        ]);

        const enrichedUsers = users.map(user => {
            const userIdStr = user._id.toString();
            const userOrders = allOrders.filter(o => o.userId?.toString() === userIdStr);
            const userCart = allCarts.filter(c => c.userId?.toString() === userIdStr);
            const userWishlist = allWishlists.filter(w => w.userId?.toString() === userIdStr);

            return {
                ...user,
                orderCount: userOrders.length,
                totalSpent: userOrders.reduce((sum, o) => sum + (o.totalAmount || o.totalbill || 0), 0),
                cartCount: userCart.reduce((sum, c) => sum + (c.items?.length || 0), 0),
                wishlistCount: userWishlist.reduce((sum, w) => sum + (w.productIds?.length || 0), 0)
            };
        });

        res.status(200).json({ message: "User Fetch Successfully", users: enrichedUsers });
    } catch (error) {
        console.error('[DEBUG] AllUser Error:', error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const user = await adminService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ message: "User not Find" });
        res.status(200).json({ message: "User Delete Successfully" });
    } catch (error) { res.status(400).json({ message: error.message }); }
};

module.exports.updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        if (req.user.role !== "admin") return res.status(401).json({ message: "Access Denined !!" });
        const user = await adminService.updateUserRole({ userId, role });
        if (!user) throw new Error("User Not Found !!");
        res.status(200).json({ message: "User Role Updated Successfully", user });
    } catch (error) { res.status(400).json({ message: error.message }); }
};

module.exports.GetAllFaqs = async (req, res) => {
    try {
        const faqs = await faqModel.find().sort({ order: 1 });
        res.status(200).json(faqs);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.CreateFaq = async (req, res) => {
    try {
        const { question, answer, category, order } = req.body;
        const faq = await faqModel.create({ question, answer, category, order });
        res.status(201).json({ message: "FAQ created successfully", faq });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.UpdateFaq = async (req, res) => {
    try {
        const { faqId } = req.params;
        const faq = await faqModel.findByIdAndUpdate(faqId, req.body, { new: true });
        if (!faq) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json({ message: "FAQ updated successfully", faq });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.DeleteFaq = async (req, res) => {
    try {
        const { faqId } = req.params;
        const faq = await faqModel.findByIdAndDelete(faqId);
        if (!faq) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.GetAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate('userId', 'username email').populate('items.productId').sort({ createdAt: -1 });
        res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.UpdateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findByIdAndUpdate(orderId, req.body, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: `Order status updated`, order });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.ToggleUserStatus = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.status = user.status === 'active' ? 'suspended' : 'active';
        await user.save();
        res.status(200).json({ message: `User status changed`, status: user.status });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports.GetUserInsights = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('[DEBUG] Insights requested for ID:', id);
        
        // Fetch all and filter in JS to be 100% resilient to ID types
        const [cart, wishlist, orders] = await Promise.all([
            cartModel.find({}).populate("items.productId").lean(),
            wishlistModel.find({}).populate("productIds.item.productId").lean(),
            orderModel.find({}).populate("items.productId").lean()
        ]);

        const userCart = cart.find(c => c.userId?.toString() === id.toString());
        const userWishlist = wishlist.find(w => w.userId?.toString() === id.toString());
        const userOrders = orders.filter(o => o.userId?.toString() === id.toString());

        console.log('[DEBUG] Data fetch complete for ID:', id);
        res.status(200).json({
            cart: userCart?.items || [],
            wishlist: userWishlist?.productIds?.map(p => p.item.productId || p.item) || [],
            orders: userOrders || []
        });
    } catch (err) {
        console.error('[DEBUG] Insights error:', err.message);
        res.status(500).json({ message: `Protocol Failure: ${err.message}` });
    }
};
