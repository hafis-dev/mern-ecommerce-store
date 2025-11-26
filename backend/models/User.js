// ...existing code...
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+?\d{7,15}$/, "Please provide a valid phone number"],
    },

    password: { type: String, required: true },

    // 🔥 NEW — replaces role system
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
// ...existing code...
