const couponModel = require("../models/coupon.model");

module.exports.CreateCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.create(req.body);
        res.status(201).json({ message: "Coupon created successfully", coupon });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.GetAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.DeleteCoupon = async (req, res) => {
    try {
        await couponModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Coupon deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.ValidateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const coupon = await couponModel.findOne({ code, isActive: true });

        if (!coupon) return res.status(404).json({ message: "Invalid or expired coupon" });
        if (new Date() > coupon.expiryDate) return res.status(400).json({ message: "Coupon expired" });
        if (cartTotal < coupon.minOrderValue) return res.status(400).json({ message: `Minimum order of $${coupon.minOrderValue} required` });
        if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Usage limit reached" });

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        } else {
            discount = coupon.discountValue;
        }

        res.status(200).json({ discount, message: "Coupon applied" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
