const { MongoClient } = require('mongodb');
async function list() {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    try {
        await client.connect();
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        console.log(JSON.stringify(dbs, null, 2));
    } finally {
        await client.close();
        process.exit();
    }
}
list();
