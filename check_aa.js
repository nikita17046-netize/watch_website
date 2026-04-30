const { MongoClient } = require('mongodb');
async function check() {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    try {
        await client.connect();
        const db = client.db('mongodb-aa');
        const collections = await db.listCollections().toArray();
        console.log('Collections in mongodb-aa:', collections.map(c => c.name));
        if (collections.some(c => c.name === 'products')) {
            const products = await db.collection('products').find().limit(5).toArray();
            console.log('Products in mongodb-aa:', products.map(p => p.name));
        }
    } finally {
        await client.close();
        process.exit();
    }
}
check();
