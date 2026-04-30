const mongoose = require('mongoose');
async function check() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        const products = await mongoose.connection.db.collection('products').find().limit(5).toArray();
        console.log('Sample products from ecommerce:', products.map(p => p.name));
        await mongoose.disconnect();
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
