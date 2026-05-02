const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist = async ({ userId, item }) => {
    let wishlist = await wishlistModel.findOne({ userId });

    if (!wishlist) {
        wishlist = new wishlistModel({ userId, productIds: [] });
    }

    // Check if product already in wishlist (model structure: productIds: [ { item: { productId: ... } } ])
    const exists = wishlist.productIds.some(p => 
        p.item && p.item.productId && p.item.productId.toString() === item.productId.toString()
    );
    
    if (!exists) {
        wishlist.productIds.push({ item });
        await wishlist.save();
    }
    
    return await wishlistModel.findOne({ userId }).populate('productIds.item.productId');
}

// get wishlist items
module.exports.GetWishlist = async ({ userId }) => {
    return await wishlistModel.findOne({ userId }).populate('productIds.item.productId');
}

// remove item from wishlist
module.exports.RemoveFromWishlist = async ({ userId, productId }) => {
    let wishlist = await wishlistModel.findOne({ userId });
    
    if (wishlist) {
        wishlist.productIds = wishlist.productIds.filter(p => 
            p.item && p.item.productId && p.item.productId.toString() !== productId.toString()
        );
        await wishlist.save();
    }
    
    return await wishlistModel.findOne({ userId }).populate('productIds.item.productId');
}