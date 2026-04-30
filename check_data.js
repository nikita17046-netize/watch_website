const mongoose = require('mongoose');
async function check() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ecomerce');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in ecomerce:', collections.map(c => c.name));
        if (collections.some(c => c.name === 'products')) {
            const count = await mongoose.connection.db.collection('products').countDocuments();
            console.log('Product count in ecomerce:', count);
        }
        await mongoose.disconnect();

        await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
        const collections2 = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in ecommerce:', collections2.map(c => c.name));
        if (collections2.some(c => c.name === 'products')) {
            const count = await mongoose.connection.db.collection('products').countDocuments();
            console.log('Product count in ecommerce:', count);
        }
        await mongoose.disconnect();
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
