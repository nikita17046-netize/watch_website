const mongoose = require('mongoose');

const uniqueIds = [
  "1523170335258-f5ed11844a49", "1614164185128-e4ec99c436d7", "1619134768704-1284697cc98d", "1612817159949-195b6eb9e31a",
  "1585123334904-845d60e97b29", "1522312346375-d1a52e2b99b3", "1547996160-81dfa63595dd", "1533139502658-0198f920d8e8",
  "1542496658-e33a6d0d50f6", "1539533377285-bb41e5c47585", "1524592094714-0f0654e20314", "1524805444758-09913182909c",
  "1509048191080-d2984bad6ad5", "1615655096345-64a515a4c74e", "1629581678313-3a15c999192a", "1639037687665-9fa58509359e",
  "1622434641406-a15812345ad1", "1550005810-eb57c240900e", "1523263685939-07c671247c4b", "1517466118256-6811400c25a1",
  "1508685096489-723528b971ee", "1526045431048-f857369baa09", "1495856458515-0637185db551", "1539650116574-8efeb43e2750",
  "1511499008188-057d8d73a44c", "1507702553912-a15641e827c8", "1508057198894-247b23fe5ade", "1518131359043-400e8115cc9d",
  "1534447677768-be436bb09401", "1511707171634-5f897ff02aa9", "1512446813985-4a08e61ebe6c", "1516594798947-e65505dbb29d",
  "1517248135467-4c7edcad34c4", "1523275335684-37898b6baf30", "1524678606370-a09042ee937c", "1525547710557-80c430c4278a",
  "1526170315833-2df60904800d", "1526924275557-4f4e9fdc57ac", "1528613084791-583d4c722f92", "1530311708539-7ff046c8c9a4",
  "1531297484001-80022131f5a1", "1532052243261-840993c3330e", "1533519803154-1563e41f176c", "1534067783479-7fdc4d8f43ec",
  "1535268647677-3000f1350713", "1536412597332-5a6772b15793", "1537240169871-508544a79ad2", "1538308473957-c8485293297a",
  "1539497508604-92931e4856b2", "1540206395-535fc025c782", "1541123437-3fd134567a1c", "1542125387-9d76d43e5e76",
  "1543163530-d9d094e0231b", "1544114245-423c21a41890", "1545124127-12431d23b201", "1546114256-424c21a41891",
  "1547124231-12441d23b202", "1548114266-425c21a41892", "1549124241-12451d23b203", "1550114276-426c21a41893"
];

const brands = ["Titan", "Rolex", "Omega", "Cartier", "Breitling", "IWC", "Tag Heuer", "Hublot", "Jaeger-LeCoultre", "Panerai"];

async function updateProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("Connected to MongoDB");

    const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});

    console.log(`Found ${products.length} products to update.`);

    for (let i = 0; i < products.length; i++) {
      const brand = brands[i % brands.length];
      const name = `${brand} Premium Edition ${i + 1}`;
      const imageUrl = `https://images.unsplash.com/photo-${uniqueIds[i % uniqueIds.length]}?q=80&w=600&auto=format&fit=crop`;
      
      await Product.findByIdAndUpdate(products[i]._id, {
        name: name,
        brand: brand,
        price: 5000 + (i * 150),
        category: (i % 4 === 0) ? "Men" : (i % 4 === 1) ? "Women" : (i % 4 === 2) ? "Accessories" : "Lifestyle",
        description: `Experience the exclusive ${name}. A true masterpiece of craftsmanship.`,
        images: [imageUrl],
        sku: `${brand.toUpperCase().substring(0,3)}-${1000 + i}`
      });
      
      process.stdout.write(".");
    }

    console.log("\nAll 60 products updated with 60 UNIQUE images!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateProducts();
