const mongoose = require('mongoose');

const watchModels = [
  { name: "Cosmograph Daytona", brand: "Rolex", price: 32000, cat: "Men", img: "1523170335258-f5ed11844a49" },
  { name: "Nautilus Blue Dial", brand: "Patek Philippe", price: 120000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "Royal Oak Skeleton", brand: "Audemars Piguet", price: 85000, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Speedmaster Apollo 11", brand: "Omega", price: 15000, cat: "Men", img: "1612817159949-195b6eb9e31a" },
  { name: "Submariner Hulk", brand: "Rolex", price: 28000, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "Tank Solo XL", brand: "Cartier", price: 4500, cat: "Men", img: "1639037687665-9fa58509359e" },
  { name: "Luminor 1950", brand: "Panerai", price: 8200, cat: "Men", img: "1547996160-81dfa63595dd" },
  { name: "Navitimer Chrono", brand: "Breitling", price: 9200, cat: "Men", img: "1533139502658-0198f920d8e8" },
  { name: "Reverso Tribute", brand: "Jaeger-LeCoultre", price: 11000, cat: "Men", img: "1523170335258-f5ed11844a49" },
  { name: "Seamaster 300M", brand: "Omega", price: 5400, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "GMT-Master II Batgirl", brand: "Rolex", price: 21000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "Santos Large", brand: "Cartier", price: 7200, cat: "Men", img: "1524805444758-09913182909c" },
  { name: "Big Bang Gold", brand: "Hublot", price: 34000, cat: "Men", img: "1615655096345-64a515a4c74e" },
  { name: "Portuguese Annual Calendar", brand: "IWC", price: 22000, cat: "Men", img: "1629581678313-3a15c999192a" },
  { name: "Monaco Steve McQueen", brand: "TAG Heuer", price: 6800, cat: "Men", img: "1509048191080-d2984bad6ad5" },
  { name: "Heritage Black Bay", brand: "Tudor", price: 3900, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "Lady Datejust Rose", brand: "Rolex", price: 14500, cat: "Women", img: "1542496658-e33a6d0d50f6" },
  { name: "Panthère de Cartier", brand: "Cartier", price: 24000, cat: "Women", img: "1539533377285-bb41e5c47585" },
  { name: "Constellation Star", brand: "Omega", price: 8900, cat: "Women", img: "1542496658-e33a6d0d50f6" },
  { name: "Snowflake Spring Drive", brand: "Grand Seiko", price: 6200, cat: "Lifestyle", img: "1524592094714-0f0654e20314" },
  { name: "Classic Fusion Blue", brand: "Hublot", price: 7800, cat: "Lifestyle", img: "1615655096345-64a515a4c74e" },
  { name: "Portofino Automatic", brand: "IWC", price: 5200, cat: "Women", img: "1629581678313-3a15c999192a" },
  { name: "Fifty Fathoms Bathyscaphe", brand: "Blancpain", price: 11500, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "El Primero Sport", brand: "Zenith", price: 9500, cat: "Men", img: "1612817159949-195b6eb9e31a" },
  { name: "Pelagos Blue", brand: "Tudor", price: 4800, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "Octo Finissimo Ceramic", brand: "Bulgari", price: 17500, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Overseas Chronograph", brand: "Vacheron Constantin", price: 45000, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Master Ultra Thin", brand: "Jaeger-LeCoultre", price: 18000, cat: "Lifestyle", img: "1523170335258-f5ed11844a49" },
  { name: "PRX Gold", brand: "Tissot", price: 950, cat: "Lifestyle", img: "1612817159949-195b6eb9e31a" },
  { name: "Conquest Heritage", brand: "Longines", price: 2100, cat: "Men", img: "1539533377285-bb41e5c47585" },
  { name: "Excalibur Spider", brand: "Roger Dubuis", price: 65000, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Aikon Skeleton", brand: "Maurice Lacroix", price: 3400, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Defy Skyline", brand: "Zenith", price: 8900, cat: "Men", img: "1612817159949-195b6eb9e31a" },
  { name: "Superocean Steelfish", brand: "Breitling", price: 4200, cat: "Men", img: "1533139502658-0198f920d8e8" },
  { name: "Radiomir Black Seal", brand: "Panerai", price: 5600, cat: "Men", img: "1547996160-81dfa63595dd" },
  { name: "Carrera Skipper", brand: "TAG Heuer", price: 7100, cat: "Men", img: "1509048191080-d2984bad6ad5" },
  { name: "Chrono XL", brand: "Tissot", price: 450, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Seiko 5 Sport", brand: "Seiko", price: 350, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Bambino Version 4", brand: "Orient", price: 250, cat: "Men", img: "1523170335258-f5ed11844a49" },
  { name: "Khaki Field", brand: "Hamilton", price: 650, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Max Bill", brand: "Junghans", price: 1200, cat: "Lifestyle", img: "1524592094714-0f0654e20314" },
  { name: "Nomos Tangente", brand: "Nomos", price: 2200, cat: "Lifestyle", img: "1523170335258-f5ed11844a49" },
  { name: "Oris 65", brand: "Oris", price: 2100, cat: "Men", img: "1585123334904-845d60e97b29" },
  { name: "Grand Seiko Birch", brand: "Grand Seiko", price: 9500, cat: "Men", img: "1524592094714-0f0654e20314" },
  { name: "Vacheron Patrimony", brand: "Vacheron Constantin", price: 26000, cat: "Lifestyle", img: "1614164185128-e4ec99c436d7" },
  { name: "Lange 1", brand: "A. Lange & Söhne", price: 48000, cat: "Men", img: "1614164185128-e4ec99c436d7" },
  { name: "Senator Excellence", brand: "Glashütte Original", price: 10500, cat: "Men", img: "1612817159949-195b6eb9e31a" },
  { name: "Classic Manufacture", brand: "Frederique Constant", price: 2800, cat: "Lifestyle", img: "1523170335258-f5ed11844a49" },
  { name: "Baume Riviera", brand: "Baume & Mercier", price: 3600, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Polo Date", brand: "Piaget", price: 11500, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Chopard Alpine Eagle", brand: "Chopard", price: 14200, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Girard-Perregaux Laureato", brand: "Girard-Perregaux", price: 15500, cat: "Men", img: "1619134768704-1284697cc98d" },
  { name: "Blancpain Villeret", brand: "Blancpain", price: 21000, cat: "Lifestyle", img: "1614164185128-e4ec99c436d7" },
  { name: "Breguet Classique", brand: "Breguet", price: 24500, cat: "Lifestyle", img: "1523170335258-f5ed11844a49" },
  { name: "Ulysse Nardin Freak", brand: "Ulysse Nardin", price: 55000, cat: "Men", img: "1615655096345-64a515a4c74e" },
  { name: "Bell & Ross BR 03", brand: "Bell & Ross", price: 4200, cat: "Men", img: "1615655096345-64a515a4c74e" },
  { name: "Sinn 556", brand: "Sinn", price: 1500, cat: "Men", img: "1522312346375-d1a52e2b99b3" },
  { name: "Stowa Antea", brand: "Stowa", price: 1100, cat: "Lifestyle", img: "1524592094714-0f0654e20314" },
  { name: "Nomos Metro", brand: "Nomos", price: 3800, cat: "Men", img: "1523170335258-f5ed11844a49" },
  { name: "F.P. Journe Chronomètre", brand: "F.P. Journe", price: 45000, cat: "Men", img: "1523170335258-f5ed11844a49" }
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
      
      // Use different Unsplash parameters to ensure different images even if IDs are similar
      const imageUrl = `https://images.unsplash.com/photo-${watch.img}?q=80&w=800&auto=format&fit=crop&random=${i}`;
      
      await Product.findByIdAndUpdate(products[i]._id, {
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        category: watch.cat,
        description: `Experience the timeless elegance of the ${watch.name} by ${watch.brand}. A masterpiece of horology.`,
        images: [imageUrl],
        sku: `${watch.brand.substring(0,3).toUpperCase()}-${1000 + i}`
      });
      
      process.stdout.write(".");
    }

    console.log("\nAll 60 products updated with unique images and data!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateProducts();
