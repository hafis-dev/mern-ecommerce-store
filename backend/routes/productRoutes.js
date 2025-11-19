const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// ==============================
// PUBLIC ROUTES
// ==============================
router.get("/", getProducts); // Get all (with filters)
router.get("/:id", getProductById); // Get one product

// ==============================
// ADMIN ROUTES
// ==============================
router.post("/", authMiddleware, adminMiddleware,upload.array('images',5), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
