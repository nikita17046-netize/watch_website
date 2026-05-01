const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkDetails() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const stats = {};

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            stats[col.name] = count;
        }

        const orders = await db.collection('orders').find().toArray();
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        console.log('--- Website Details ---');
        console.log('Total Products:', stats.products || 0);
        console.log('Total Users:', stats.users || 0);
        console.log('Total Orders:', stats.orders || 0);
        console.log('Total Revenue:', '₹' + totalRevenue.toLocaleString());
        
        const pendingOrders = await db.collection('orders').countDocuments({ status: 'Pending' });
        console.log('Pending Orders:', pendingOrders);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDetails();
