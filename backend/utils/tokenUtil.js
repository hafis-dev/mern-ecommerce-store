const jwt = require("jsonwebtoken");

// Access Token now includes isAdmin
const generateAccessToken = (id, isAdmin) => {
  return jwt.sign(
    { id: id, isAdmin: isAdmin }, // 🔥 added isAdmin
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // better value, 15 minutes
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };
