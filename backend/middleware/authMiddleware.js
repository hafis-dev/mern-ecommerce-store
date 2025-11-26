const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // includes user.isAdmin
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
};

// NEW Admin middleware (using isAdmin instead of role)
const adminMiddleware = (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as admin" });
};

module.exports = { authMiddleware, adminMiddleware };
