const express = require("express");
const router = express.Router();

const {
  getWishlist,
  toggleWishlist,
  clearWishlist,
} = require("../controllers/wishlist.controller");

const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getWishlist);
router.post("/toggle", authMiddleware, toggleWishlist);
router.delete("/clear", authMiddleware, clearWishlist);

module.exports = router;
