// ...existing code...
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cors()); // move CORS before routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});
connectDB(); // connect DB before registering routes/listening

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// ...existing code...
