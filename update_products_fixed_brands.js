const mongoose = require('mongoose');

const watchModels = [
  // TITAN PRODUCTS (15)
  { name: "Titan Edge Zenith", brand: "Titan", price: 1200, cat: "Men", img: "1523170335258-f5ed11844a49" },
  { name: "Titan Raga Aura", brand: "Titan", price: 850, cat: "Women", img: "1542496658-e33a6d0d50f6" },
  { name: "Titan Octane Pro", brand: "Titan", price: 1100, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Titan Edge Ceramic", brand: "Titan", price: 1500, cat: "Lifestyle", img: "1612817159949-195b6eb9e31a" },
  { name: "Titan Grandmaster", brand: "Titan", price: 1400, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "Titan Regalia Gold", brand: "Titan", price: 2200, cat: "Men", img: "1639037687665-9fa58509359e" },
  { name: "Titan Raga Viva", brand: "Titan", price: 950, cat: "Women", img: "1539533377285-bb41e5c47585" },
  { name: "Titan Edge Slim", brand: "Titan", price: 1300, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Titan Maritime", brand: "Titan", price: 1600, cat: "Men", img: "1547996160-81dfa63595dd" },
  { name: "Titan Stellar", brand: "Titan", price: 1800, cat: "Lifestyle", img: "1533139502658-0198f920d8e8" },
  { name: "Titan Edge Fusion", brand: "Titan", price: 1450, cat: "Men", img: "1524592094714-0f0654e20314" },
  { name: "Titan Raga Moonlight", brand: "Titan", price: 1100, cat: "Women", img: "1524805444758-09913182909c" },
  { name: "Titan Karishma", brand: "Titan", price: 500, cat: "Lifestyle", img: "1509048191080-d2984bad6ad5" },
  { name: "Titan Edge Mechanical", brand: "Titan", price: 2500, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "Titan Celestial", brand: "Titan", price: 1900, cat: "Lifestyle", img: "1615655096345-64a515a4c74e" },

  // ROLEX PRODUCTS (15)
  { name: "Rolex Submariner Hulk", brand: "Rolex", price: 28000, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "Rolex Daytona Gold", brand: "Rolex", price: 42000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "Rolex GMT Batgirl", brand: "Rolex", price: 21000, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Rolex Datejust 41", brand: "Rolex", price: 13500, cat: "Men", img: "1523170335258-f5ed11844a49" },
  { name: "Rolex Oyster Perpetual", brand: "Rolex", price: 8500, cat: "Lifestyle", img: "1522312346375-d1a52e2b99b3" },
  { name: "Rolex Yacht-Master", brand: "Rolex", price: 32000, cat: "Men", img: "1533139502658-0198f920d8e8" },
  { name: "Rolex Sea-Dweller", brand: "Rolex", price: 16000, cat: "Men", img: "1547996160-81dfa63595dd" },
  { name: "Rolex Explorer I", brand: "Rolex", price: 9200, cat: "Men", img: "1639037687665-9fa58509359e" },
  { name: "Rolex Milgauss Blue", brand: "Rolex", price: 11500, cat: "Lifestyle", img: "1612817159949-195b6eb9e31a" },
  { name: "Rolex Lady-Datejust Diamond", brand: "Rolex", price: 18500, cat: "Women", img: "1542496658-e33a6d0d50f6" },
  { name: "Rolex Sky-Dweller Blue", brand: "Rolex", price: 24000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "Rolex Cellini Moon", brand: "Rolex", price: 26500, cat: "Lifestyle", img: "1524592094714-0f0654e20314" },
  { name: "Rolex Air-King", brand: "Rolex", price: 8200, cat: "Men", img: "1509048191080-d2984bad6ad5" },
  { name: "Rolex Day-Date 40", brand: "Rolex", price: 38000, cat: "Men", img: "1615655096345-64a515a4c74e" },
  { name: "Rolex Explorer II White", brand: "Rolex", price: 12500, cat: "Men", img: "1629581678313-3a15c999192a" },

  // OMEGA & CARTIER & OTHERS (30)
  { name: "Omega Speedmaster Moon", brand: "Omega", price: 7400, cat: "Men", img: "1612817159949-195b6eb9e31a" },
  { name: "Cartier Santos XL", brand: "Cartier", price: 7800, cat: "Men", img: "1524805444758-09913182909c" },
  { name: "Patek Nautilus", brand: "Patek Philippe", price: 95000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "AP Royal Oak", brand: "Audemars Piguet", price: 42000, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Cartier Tank Louis", brand: "Cartier", price: 11500, cat: "Women", img: "1524805444758-09913182909c" },
  { name: "Omega Seamaster 300", brand: "Omega", price: 5600, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Breitling Navitimer", brand: "Breitling", price: 8400, cat: "Men", img: "1533139502658-0198f920d8e8" },
  { name: "IWC Big Pilot", brand: "IWC", price: 13500, cat: "Men", img: "1629581678313-3a15c999192a" },
  { name: "Hublot Big Bang", brand: "Hublot", price: 21000, cat: "Men", img: "1615655096345-64a515a4c74e" },
  { name: "Zenith Defy", brand: "Zenith", price: 9200, cat: "Men", img: "1612817159949-195b6eb9e31a" },
  { name: "Tudor Black Bay 58", brand: "Tudor", price: 4200, cat: "Lifestyle", img: "1585123334904-845d60e97b29" },
  { name: "Cartier Panthere Gold", brand: "Cartier", price: 22000, cat: "Women", img: "1539533377285-bb41e5c47585" },
  { name: "Omega Aqua Terra", brand: "Omega", price: 6200, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Vacheron Overseas", brand: "Vacheron Constantin", price: 36000, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Panerai Luminor Blue", brand: "Panerai", price: 9800, cat: "Men", img: "1547996160-81dfa63595dd" },
  { name: "TAG Heuer Carrera", brand: "TAG Heuer", price: 5400, cat: "Men", img: "1509048191080-d2984bad6ad5" },
  { name: "Grand Seiko Snowflake", brand: "Grand Seiko", price: 6800, cat: "Lifestyle", img: "1524592094714-0f0654e20314" },
  { name: "Cartier Ballon Bleu", brand: "Cartier", price: 5800, cat: "Women", img: "1524805444758-09913182909c" },
  { name: "Omega Constellation", brand: "Omega", price: 8200, cat: "Women", img: "1542496658-e33a6d0d50f6" },
  { name: "Patek Aquanaut", brand: "Patek Philippe", price: 48000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "IWC Portofino", brand: "IWC", price: 5200, cat: "Lifestyle", img: "1629581678313-3a15c999192a" },
  { name: "Breitling Superocean", brand: "Breitling", price: 4800, cat: "Men", img: "1533139502658-0198f920d8e8" },
  { name: "Hublot Classic Fusion", brand: "Hublot", price: 8500, cat: "Lifestyle", img: "1615655096345-64a515a4c74e" },
  { name: "Bulgari Octo", brand: "Bulgari", price: 14500, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Luxury Cufflinks Gold", brand: "Cartier", price: 1200, cat: "Accessories", img: "1523170335258-f5ed11844a49" },
  { name: "Leather Travel Case", brand: "Luxe", price: 450, cat: "Accessories", img: "1524592094714-0f0654e20314" },
  { name: "Watch Winder Pro", brand: "Luxe", price: 850, cat: "Accessories", img: "1615655096345-64a515a4c74e" },
  { name: "Cleaning Kit Elite", brand: "Luxe", price: 120, cat: "Accessories", img: "1522312346375-d1a52e2b99b3" },
  { name: "Velvet Pouch", brand: "Luxe", price: 45, cat: "Accessories", img: "1539533377285-bb41e5c47585" },
  { name: "Display Stand Marble", brand: "Luxe", price: 290, cat: "Accessories", img: "1639037687665-9fa58509359e" }
];

async function updateProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("Connected to MongoDB");

    const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});

    console.log(`Found ${products.length} products to update.`);

    for (let i = 0; i < products.length; i++) {
      const watch = watchModels[i] || watchModels[i % watchModels.length];
      
      const imageUrl = `https://images.unsplash.com/photo-${watch.img}?q=80&w=800&auto=format&fit=crop&random=${i + 100}`;
      
      await Product.findByIdAndUpdate(products[i]._id, {
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        category: watch.cat,
        description: `Exquisite ${watch.name} by ${watch.brand}. A masterpiece of horology and style.`,
        images: [imageUrl],
        sku: `${watch.brand.substring(0,3).toUpperCase()}-${2000 + i}`,
        isSale: i % 10 === 0 // Mark some products as sale for the Special Offers link
      });
      
      process.stdout.write(".");
    }

    console.log("\nAll 60 products updated! Titan and Rolex collections are now full.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateProducts();
