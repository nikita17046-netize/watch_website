const mongoose = require('mongoose');

async function checkCart() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  const cartSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' }, quantity: Number }]
  });
  const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String
  });
  
  const Cart = mongoose.model('cart', cartSchema);
  const Product = mongoose.model('product', productSchema);
  
  const carts = await Cart.find().populate('items.productId');
  console.log('Total Carts:', carts.length);
  if (carts.length > 0) {
    console.log('Sample Cart Items:', JSON.stringify(carts[0].items, null, 2));
  }
  process.exit();
}

checkCart();
