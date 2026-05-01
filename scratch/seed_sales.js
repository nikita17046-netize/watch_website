const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function seedSales() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const users = await db.collection('users').find({ role: 'user' }).toArray();
        if (users.length === 0) {
            console.log('No users found to assign orders to.');
            process.exit(0);
        }

        // Generate sales for last 12 days
        const sales = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            
            sales.push({
                userId: users[Math.floor(Math.random() * users.length)]._id,
                items: [],
                totalAmount: Math.floor(Math.random() * 50000) + 10000,
                status: Math.random() > 0.2 ? 'Delivered' : 'Pending',
                createdAt: date,
                updatedAt: date
            });
        }

        await db.collection('orders').insertMany(sales);
        console.log('Successfully seeded 12 new sales records.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedSales();
