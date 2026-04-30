const mongoose = require('mongoose');

async function checkCartRaw() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  const cartSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }]
  });
  
  const Cart = mongoose.model('cart_raw', cartSchema, 'carts');
  
  const carts = await Cart.find();
  console.log('Raw Cart Items:', JSON.stringify(carts, null, 2));
  process.exit();
}

checkCartRaw();
