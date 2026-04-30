const mongoose = require('mongoose');

const luxuryWatches = [
  {
    name: "Submariner Date",
    brand: "Rolex",
    price: 14500,
    category: "Men",
    description: "The benchmark among divers' watches, a masterpiece of precision and reliability.",
    image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=1000"
  },
  {
    name: "Nautilus 5711",
    brand: "Patek Philippe",
    price: 85000,
    category: "Men",
    description: "The pinnacle of luxury sports watches, featuring an iconic octagonal bezel.",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000"
  },
  {
    name: "Royal Oak Selfwinding",
    brand: "Audemars Piguet",
    price: 42000,
    category: "Men",
    description: "The watch that changed the industry forever, with its revolutionary steel design.",
    image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=1000"
  },
  {
    name: "Speedmaster Professional",
    brand: "Omega",
    price: 7200,
    category: "Men",
    description: "The Moonwatch, tested by NASA for every manned space mission.",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1000"
  },
  {
    name: "Daytona Platinum",
    brand: "Rolex",
    price: 95000,
    category: "Men",
    description: "A watch born to race, the ultimate tool for endurance racing drivers.",
    image: "https://images.unsplash.com/photo-1622434641406-a15812345ad1?q=80&w=1000"
  },
  {
    name: "Lady-Datejust 28",
    brand: "Rolex",
    price: 12800,
    category: "Women",
    description: "A classic of femininity, elegance and precision in a smaller diameter.",
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000"
  },
  {
    name: "Tank Louis Cartier",
    brand: "Cartier",
    price: 11200,
    category: "Women",
    description: "Inspired by the design of military tanks, a symbol of pure elegance.",
    image: "https://images.unsplash.com/photo-1524805444758-09913182909c?q=80&w=1000"
  },
  {
    name: "Reverso Classic",
    brand: "Jaeger-LeCoultre",
    price: 8900,
    category: "Lifestyle",
    description: "The unique swivelling case originally designed for polo players.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000"
  },
  {
    name: "Luminor Marina",
    brand: "Panerai",
    price: 9800,
    category: "Men",
    description: "Italian design meets Swiss precision, known for its distinctive crown guard.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000"
  },
  {
    name: "Navitimer B01",
    brand: "Breitling",
    price: 8400,
    category: "Men",
    description: "The pilot's favorite, featuring the legendary circular slide rule.",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000"
  }
];

async function updateProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("Connected to MongoDB");

    const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});

    console.log(`Found ${products.length} products to update.`);

    for (let i = 0; i < products.length; i++) {
      const dataIndex = i % luxuryWatches.length;
      const watch = luxuryWatches[dataIndex];
      
      // Add a random variation to name if we repeat
      const suffix = Math.floor(i / luxuryWatches.length) > 0 ? ` ${Math.floor(i / luxuryWatches.length) + 1}` : '';
      
      await Product.findByIdAndUpdate(products[i]._id, {
        name: watch.name + suffix,
        brand: watch.brand,
        price: watch.price + (Math.floor(Math.random() * 500)), // Slight price variation
        category: watch.category,
        description: watch.description,
        images: [watch.image],
        sku: `${watch.brand.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`
      });
      
      process.stdout.write(".");
    }

    console.log("\nAll products updated with premium luxury data!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateProducts();
