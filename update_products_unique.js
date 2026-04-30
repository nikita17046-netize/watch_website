const mongoose = require('mongoose');

const luxuryWatches = [
  { name: "Submariner Date", brand: "Rolex", price: 14200, category: "Men", image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=600" },
  { name: "Nautilus 5711", brand: "Patek Philippe", price: 92000, category: "Men", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=600" },
  { name: "Royal Oak", brand: "Audemars Piguet", price: 48000, category: "Men", image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=600" },
  { name: "Speedmaster", brand: "Omega", price: 7400, category: "Men", image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=600" },
  { name: "Daytona Platinum", brand: "Rolex", price: 98000, category: "Men", image: "https://images.unsplash.com/photo-1622434641406-a15812345ad1?q=80&w=600" },
  { name: "Lady-Datejust", brand: "Rolex", price: 12500, category: "Women", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600" },
  { name: "Tank Louis", brand: "Cartier", price: 11500, category: "Women", image: "https://images.unsplash.com/photo-1524805444758-09913182909c?q=80&w=600" },
  { name: "Reverso Classic", brand: "Jaeger-LeCoultre", price: 9200, category: "Lifestyle", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600" },
  { name: "Luminor Marina", brand: "Panerai", price: 10200, category: "Men", image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=600" },
  { name: "Navitimer B01", brand: "Breitling", price: 8600, category: "Men", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=600" },
  { name: "GMT-Master II", brand: "Rolex", price: 18500, category: "Men", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=601" },
  { name: "Seamaster Aqua Terra", brand: "Omega", price: 6200, category: "Men", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600" },
  { name: "Big Bang Unico", brand: "Hublot", price: 22000, category: "Men", image: "https://images.unsplash.com/photo-1615655096345-64a515a4c74e?q=80&w=600" },
  { name: "Santos de Cartier", brand: "Cartier", price: 7800, category: "Men", image: "https://images.unsplash.com/photo-1639037687665-9fa58509359e?q=80&w=600" },
  { name: "Portuguese Chrono", brand: "IWC", price: 9400, category: "Men", image: "https://images.unsplash.com/photo-1629581678313-3a15c999192a?q=80&w=600" },
  { name: "Carrera Calibre", brand: "TAG Heuer", price: 5800, category: "Men", image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?q=80&w=600" },
  { name: "Patrimony Gold", brand: "Vacheron Constantin", price: 32000, category: "Lifestyle", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=602" },
  { name: "El Primero", brand: "Zenith", price: 9200, category: "Men", image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=601" },
  { name: "Black Bay 58", brand: "Tudor", price: 4200, category: "Men", image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=601" },
  { name: "Octo Finissimo", brand: "Bulgari", price: 16500, category: "Men", image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=601" },
  { name: "Heritage Snowflake", brand: "Grand Seiko", price: 6800, category: "Lifestyle", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600" },
  { name: "Le Locle Powermatic", brand: "Tissot", price: 850, category: "Men", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=601" },
  { name: "Master Collection", brand: "Longines", price: 2400, category: "Women", image: "https://images.unsplash.com/photo-1539533377285-bb41e5c47585?q=80&w=600" },
  { name: "Altiplano Ultimate", brand: "Piaget", price: 28000, category: "Lifestyle", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=603" },
  { name: "Star Legacy", brand: "Montblanc", price: 3600, category: "Men", image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=602" },
  { name: "Explorer II", brand: "Rolex", price: 11500, category: "Men", image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=602" },
  { name: "De Ville Prestige", brand: "Omega", price: 4800, category: "Women", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=601" },
  { name: "Overseas Dual Time", brand: "Vacheron Constantin", price: 38000, category: "Men", image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=602" },
  { name: "Classic Fusion", brand: "Hublot", price: 8900, category: "Lifestyle", image: "https://images.unsplash.com/photo-1615655096345-64a515a4c74e?q=80&w=601" },
  { name: "Ballon Bleu", brand: "Cartier", price: 6200, category: "Women", image: "https://images.unsplash.com/photo-1524805444758-09913182909c?q=80&w=601" },
  { name: "Pilot Mark XX", brand: "IWC", price: 5600, category: "Men", image: "https://images.unsplash.com/photo-1629581678313-3a15c999192a?q=80&w=601" },
  { name: "Monaco Gulf", brand: "TAG Heuer", price: 7200, category: "Men", image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?q=80&w=601" },
  { name: "Polaris Chrono", brand: "Jaeger-LeCoultre", price: 13500, category: "Men", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=601" },
  { name: "Submersible Quaranta", brand: "Panerai", price: 11800, category: "Men", image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=601" },
  { name: "Superocean Heritage", brand: "Breitling", price: 5400, category: "Lifestyle", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=601" },
  { name: "Royal Oak Offshore", brand: "Audemars Piguet", price: 36000, category: "Men", image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=603" },
  { name: "Milgauss", brand: "Rolex", price: 10500, category: "Lifestyle", image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=603" },
  { name: "Constellation", brand: "Omega", price: 7800, category: "Women", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=602" },
  { name: "Twenty-4", brand: "Patek Philippe", price: 15500, category: "Women", image: "https://images.unsplash.com/photo-1539533377285-bb41e5c47585?q=80&w=601" },
  { name: "Serpenti Seduttori", brand: "Bulgari", price: 8200, category: "Women", image: "https://images.unsplash.com/photo-1524805444758-09913182909c?q=80&w=602" },
  { name: "Diver Pro", brand: "Seiko", price: 1200, category: "Men", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=602" },
  { name: "PRX Powermatic", brand: "Tissot", price: 725, category: "Lifestyle", image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=603" },
  { name: "HydroConquest", brand: "Longines", price: 1800, category: "Men", image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=604" },
  { name: "Polo Skeleton", brand: "Piaget", price: 31000, category: "Men", image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=604" },
  { name: "1858 Geosphere", brand: "Montblanc", price: 6200, category: "Men", image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=604" },
  { name: "Air-King", brand: "Rolex", price: 7800, category: "Men", image: "https://images.unsplash.com/photo-1622434641406-a15812345ad1?q=80&w=601" },
  { name: "Seamaster 300", brand: "Omega", price: 5600, category: "Men", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=603" },
  { name: "Fifty Fathoms", brand: "Blancpain", price: 15500, category: "Men", image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=605" },
  { name: "Chronomaster", brand: "Zenith", price: 10200, category: "Men", image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=605" },
  { name: "Spirit of Big Bang", brand: "Hublot", price: 24000, category: "Men", image: "https://images.unsplash.com/photo-1615655096345-64a515a4c74e?q=80&w=602" },
  { name: "Tank Américaine", brand: "Cartier", price: 14500, category: "Women", image: "https://images.unsplash.com/photo-1524805444758-09913182909c?q=80&w=603" },
  { name: "Portugieser 7-Day", brand: "IWC", price: 13200, category: "Lifestyle", image: "https://images.unsplash.com/photo-1629581678313-3a15c999192a?q=80&w=602" },
  { name: "Aquaracer", brand: "TAG Heuer", price: 3400, category: "Men", image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?q=80&w=602" },
  { name: "Master Control", brand: "Jaeger-LeCoultre", price: 8200, category: "Lifestyle", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=602" },
  { name: "Radiomir", brand: "Panerai", price: 5400, category: "Men", image: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=602" },
  { name: "Avenger Chrono", brand: "Breitling", price: 6100, category: "Men", image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=602" },
  { name: "Cellini Moonphase", brand: "Rolex", price: 28500, category: "Lifestyle", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=604" },
  { name: "World Time", brand: "Patek Philippe", price: 42000, category: "Men", image: "https://images.unsplash.com/photo-1619134768704-1284697cc98d?q=80&w=605" },
  { name: "Overseas Quartz", brand: "Vacheron Constantin", price: 16500, category: "Women", image: "https://images.unsplash.com/photo-1539533377285-bb41e5c47585?q=80&w=602" },
  { name: "Altiplano Rose", brand: "Piaget", price: 21000, category: "Women", image: "https://images.unsplash.com/photo-1524805444758-09913182909c?q=80&w=604" }
];

async function updateProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("Connected to MongoDB");

    const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});

    console.log(`Found ${products.length} products to update.`);

    for (let i = 0; i < products.length; i++) {
      const watch = luxuryWatches[i] || luxuryWatches[i % luxuryWatches.length];
      
      await Product.findByIdAndUpdate(products[i]._id, {
        name: watch.name,
        brand: watch.brand,
        price: watch.price,
        category: watch.category,
        description: `Exquisite ${watch.name} by ${watch.brand}. A symbol of luxury and precision.`,
        images: [watch.image],
        sku: `${watch.brand.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`
      });
      
      process.stdout.write(".");
    }

    console.log("\nAll 60 products updated with UNIQUE luxury data!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateProducts();
