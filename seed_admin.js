const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userModel = require("./models/user.model");
const bcrypt = require("bcrypt");

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database:", process.env.MONGO_URL);

        const adminEmail = "admin@luxe.com";
        const adminPassword = "radheradhe";

        // Check if admin already exists
        let admin = await userModel.findOne({ email: adminEmail });
        
        if (admin) {
            console.log("Admin already exists. Updating password...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin.password = hashedPassword;
            admin.role = 'admin';
            await admin.save();
        } else {
            console.log("Creating new admin...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await userModel.create({
                username: "SuperAdmin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin"
            });
        }

        console.log("Admin seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
};

seedAdmin();
