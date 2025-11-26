const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 }, // allow zero
    category: {
      type: String,
      required: true,
      enum: ["Wallet", "Watch", "Glass"],
    },
    attributes: { type: Object, default: {} },
    images: [{ type: String, required: true }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
