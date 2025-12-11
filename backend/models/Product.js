const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
    },

    // NEW FIELD
    gender: {
      type: [String], // ARRAY of strings
      enum: ["Men", "Women"], // Allowed values
      required: true, // Must have at least one
    },

    attributes: { type: Object, default: {} },
    images: [{ type: String, required: true }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);
