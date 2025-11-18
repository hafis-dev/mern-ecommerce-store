const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailOrPhone: { type: String, required: true }, // Email or Phone
  otp: { type: String, required: true }, // Hashed OTP
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 600s = 10 mins
});
const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp
