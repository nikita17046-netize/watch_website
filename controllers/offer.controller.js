const offerModel = require("../models/offer.model");

module.exports.CreateOffer = async (req, res) => {
    try {
        const offer = await offerModel.create(req.body);
        res.status(201).json({ message: "Offer created successfully", offer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.GetAllOffers = async (req, res) => {
    try {
        const offers = await offerModel.find().sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.DeleteOffer = async (req, res) => {
    try {
        await offerModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Offer deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
