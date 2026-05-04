const http = require('http');

console.time('Product Fetch');
http.get('http://localhost:3005/api/v1/product/get-product', (res) => {
    console.log('Status Code:', res.statusCode);
    res.on('data', () => {});
    res.on('end', () => {
        console.timeEnd('Product Fetch');
        process.exit();
    });
}).on('error', (e) => {
    console.error('Error:', e.message);
    console.timeEnd('Product Fetch');
    process.exit(1);
});
