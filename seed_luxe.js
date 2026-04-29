const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model'); // Adjust based on model path

dotenv.config();

const products = [
  // ROLEX
  ...Array(10).fill().map((_, i) => ({
    name: `Rolex Submariner Date ${i + 1}`,
    description: 'The archetype of the diver’s watch.',
    price: 15000 + (i * 500),
    category: 'Men',
    brand: 'Rolex',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000'],
    stock: 5,
    rating: 5,
    numReviews: 10,
    sku: `ROLEX-SUB-${i + 1}`,
    isSale: false
  })),
  // TITAN
  ...Array(10).fill().map((_, i) => ({
    name: `Titan Edge Slim ${i + 1}`,
    description: 'One of the slimmest watches in the world.',
    price: 200 + (i * 20),
    category: 'Men',
    brand: 'Titan',
    images: ['https://images.unsplash.com/photo-1542491595-3015cbbfe43c?q=80&w=1000'],
    stock: 20,
    rating: 4.5,
    numReviews: 15,
    sku: `TITAN-EDGE-${i + 1}`,
    isSale: false
  })),
  // WOMEN
  ...Array(10).fill().map((_, i) => ({
    name: `Luxe Grace Women ${i + 1}`,
    description: 'Elegance for every occasion.',
    price: 3000 + (i * 300),
    category: 'Women',
    brand: 'LUXE',
    images: ['https://images.unsplash.com/photo-1508685096489-7aac291ba59e?q=80&w=1000'],
    stock: 12,
    rating: 4.8,
    numReviews: 8,
    sku: `LUXE-WOMEN-${i + 1}`,
    isSale: false
  })),
  // CHILDREN
  ...Array(10).fill().map((_, i) => ({
    name: `Kids Discovery ${i + 1}`,
    description: 'First watch for the little explorer.',
    price: 50 + (i * 5),
    category: 'Children',
    brand: 'LUXE Kids',
    images: ['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000'],
    stock: 50,
    rating: 4.2,
    numReviews: 20,
    sku: `KIDS-DISC-${i + 1}`,
    isSale: false
  })),
  // ACCESSORIES
  ...Array(10).fill().map((_, i) => ({
    name: `Leather Strap Premium ${i + 1}`,
    description: 'Handmade Italian leather strap.',
    price: 150 + (i * 10),
    category: 'Accessories',
    brand: 'LUXE',
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000'],
    stock: 100,
    rating: 4.9,
    numReviews: 30,
    sku: `LUXE-ACC-${i + 1}`,
    isSale: false
  })),
  // SPECIAL OFFERS
  ...Array(10).fill().map((_, i) => ({
    name: `Luxury Chrono Sale ${i + 1}`,
    description: 'Limited time offer on professional chronographs.',
    price: 500,
    category: 'Lifestyle',
    brand: 'Titan',
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000'],
    stock: 15,
    rating: 4.7,
    numReviews: 12,
    sku: `SALE-CHRONO-${i + 1}`,
    isSale: true
  })),
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Clear existing products to avoid duplicates and schema issues
    await Product.deleteMany({});
    
    await Product.insertMany(products);
    console.log('Database Seeded with 60+ products!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
