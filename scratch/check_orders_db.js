const mongoose = require('mongoose');

async function testAggregation() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecomerce');
        const db = mongoose.connection.db;
        const result = await db.collection('users').aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userOrders"
                }
            },
            {
                $project: {
                    username: 1,
                    orderCount: { $size: "$userOrders" },
                    totalSpent: { $sum: "$userOrders.totalbill" } // Using totalbill here
                }
            }
        ]).toArray();
        console.log('Aggregation Result:', JSON.stringify(result, null, 2));
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
testAggregation();
