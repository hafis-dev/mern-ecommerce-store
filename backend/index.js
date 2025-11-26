// ...existing code...
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend url
    credentials: true,
  })
);
// move CORS before routes
app.use(cookieParser());
app.use(express.json());
connectDB(); // connect DB before registering routes/listening

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// ...existing code...
