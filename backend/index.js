import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import paymentRoutes from "./routes/payment.route.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import checkoutRoutes from "./routes/checkout.route.js";
import orderRoutes from "./routes/order.route.js";
import profileRoutes from "./routes/profile.route.js";

const app = express();
const port = process.env.PORT || 3000;


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


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
app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());


connectDB();

app.use("/api/payment",paymentRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/wishlist", wishlistRoutes);


app.get("/", (req, res) => {
  res.send("API is running....");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
