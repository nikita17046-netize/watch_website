const wishlistService = require("../services/wishlist.service");

// add item to wishlist
module.exports.AddToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { item } = req.body;

        const wishlist = await wishlistService.AddToWishlist({ userId, item });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist Not Found !!" })
        }

        return res.status(200).json({ message: "Add Item into Wishlist", wishlist })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

// get all items from wishlist
module.exports.GetWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await wishlistService.GetWishlist({ userId });

        if (!wishlist) {
            return res.status(200).json({ message: "Wishlist Empty", wishlist: { productIds: [] } });
        }

        return res.status(200).json({ message: "Wishlist Fetched", wishlist });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// remove item from wishlist
module.exports.RemoveFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const wishlist = await wishlistService.RemoveFromWishlist({ userId, productId });

        return res.status(200).json({ message: "Item Removed from Wishlist", wishlist });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};