require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const port = process.env.PORT || 3000;

// ✅ HEALTH CHECK FIRST (FAST)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ CORS (frontend + uptime robot)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Connect DB after health
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
