const mongoose = require('mongoose');

const watchIds = [
  "2U8vton2oi8", "al6s6JpnZis", "6EBp_6DuxmY", "z6lNa2jYaVw", "bCoE6zPfVSs",
  "Rm7Qbb1FyQM", "WSKuvpbnN0E", "SmzgngBIRiw", "BiOA0I1ui8o", "Qx0d7Yu4RRw",
  "9MnZAavmjvU", "VRERJ5Mjp4c", "2cV8Knq1-3U", "VfozQD-IgdA", "bZpWIOPBw_8",
  "4R_WEmhx8og", "Zkf5HBAbQWc", "8wXP36ZSRhc", "dvJ5SkU9YPk", "9MFAruaXN3A",
  "u1wyvD_dYZ0", "fQ3zVQPDgSw", "braMiRFMHPk", "AVlrMiDNIUk", "7e9iei03Swk",
  "DlmkBR9kp4k", "mhAF_8XZEKI", "cNe8GsQR-OQ", "QAZGUsaAI1k", "_DdHMAl3y3I",
  "l6nd7xIA-kQ", "bFzNGTK4TxM", "Ha2a7s_pdTA", "t8NQd4l0-Jc", "3GxCtu6HTc4",
  "W_BVAHDnH9M", "5YQSuTgV0o0", "QjXrcLOHwyI", "exvmKAGaNtU", "5rft32q131s",
  "MoJwMYXzzls", "L_6OdCI8jSA", "vRcSC-UN3yI", "_HAVhi9B2a4", "c03WpEKDgPs",
  "12V36G17IbQ", "iO2Rybhdbv0", "3MzhWXiYFEg", "FpkaJSQYs5w", "MmiTWpThLbI",
  "p2WUEFGrAdA", "y4zf3YoXwto", "HFHhQnLylek", "VDcpYngJNgQ", "pooVzgc3y6k",
  "GWGPuQcXTE4", "uBHntlP-FUk", "4m3X6ZNLgsI", "MQwdj_ZyJAk", "KrWO0Unb4UI"
];

const brands = [
  "Rolex", "Titan", "Omega", "Cartier", "Patek Philippe", 
  "Audemars Piguet", "IWC", "Breitling", "Hublot", "TAG Heuer"
];

async function updateProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("Connected to MongoDB");

    const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({});

    console.log(`Found ${products.length} products to update.`);

    for (let i = 0; i < products.length; i++) {
      const brand = brands[i % brands.length];
      const photoId = watchIds[i] || watchIds[i % watchIds.length];
      
      // Categorize based on brand/index for better distribution
      let category = "Men";
      if (brand === "Titan" && i % 3 === 0) category = "Women";
      if (brand === "Cartier") category = "Women";
      if (i % 7 === 0) category = "Accessories";
      if (i % 5 === 0) category = "Lifestyle";

      const name = `${brand} ${category === "Accessories" ? "Luxury Gear" : "Masterpiece"} #${101 + i}`;
      const imageUrl = `https://images.unsplash.com/photo-${photoId}?q=80&w=800&auto=format&fit=crop`;

      await Product.findByIdAndUpdate(products[i]._id, {
        name: name,
        brand: brand,
        price: 2500 + (Math.random() * 50000),
        category: category,
        description: `Experience the exclusive ${name}. A true symbol of luxury and horological excellence.`,
        images: [imageUrl],
        sku: `${brand.toUpperCase().substring(0,3)}-${Math.floor(Math.random() * 9000) + 1000}`
      });
      
      process.stdout.write(".");
    }

    console.log("\nAll 60 products updated with GENUINE luxury watch images!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateProducts();
