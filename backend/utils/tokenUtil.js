const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: 5 });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };
