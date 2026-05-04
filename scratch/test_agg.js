const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ecomerce').then(async () => {
    const User = mongoose.model('user', new mongoose.Schema({}));
    const users = await User.aggregate([
        {
            $lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'userId',
                as: 'userOrders'
            }
        },
        {
            $lookup: {
                from: 'carts',
                localField: '_id',
                foreignField: 'userId',
                as: 'userCart'
            }
        },
        {
            $lookup: {
                from: 'wishlists',
                localField: '_id',
                foreignField: 'userId',
                as: 'userWishlist'
            }
        },
        {
            $project: {
                username: 1,
                orderCount: { $size: '$userOrders' },
                cartCount: { $size: '$userCart' },
                wishlistCount: { $size: '$userWishlist' }
            }
        }
    ]);
    const radhu = users.find(u => u.username && u.username.match(/Radhu/i));
    console.log('Radhu aggregation result:', JSON.stringify(radhu, null, 2));
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
