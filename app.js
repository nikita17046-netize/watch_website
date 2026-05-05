const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
// Route
const userRouter = require("./routes/web/v1/user.route");
const adminRouter = require("./routes/web/v1/admin.route");
const productRouter = require("./routes/web/v1/product.route");
const chatRouter = require("./routes/web/v1/chat.route");
const cartRouter = require("./routes/web/v1/cart.route");
const orderRouter = require("./routes/web/v1/order.route");
const wishlistRouter = require("./routes/web/v1/wishlist.route");
const reviewRouter = require("./routes/web/v1/review.route");
const contactRouter = require("./routes/web/v1/contact.route");
const adminController = require("./controllers/admin.controller");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.set(db());

app.use(cors({ origin: "http://localhost:3002", credentials: true }));

const PORT = process.env.PORT || 3005;

app.get("/", (req, res) => {
  res.status(401).json({ message: "Access Denined !!" });
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.get("/test-insights/:id", adminController.GetUserInsights);
app.use("/product", productRouter);
app.use("/bot", chatRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/wishlist", wishlistRouter);
app.use("/review", reviewRouter);
app.use("/contact", contactRouter);

app.listen(PORT, () => {
  console.log(`✅ server is Running on PORT ${PORT}`);
});
