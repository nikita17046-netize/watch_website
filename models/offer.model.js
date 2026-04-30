const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true },
    applyTo: { type: String, enum: ['all', 'category', 'product'], default: 'all' },
    targetId: { type: String }, // Can be Category name or Product ID
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    bannerImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
