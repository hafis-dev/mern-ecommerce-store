const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivalProducts,
  getFilters,
} = require("../controllers/productController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// ==============================
// PUBLIC ROUTES
// ==============================

// ⭐ Filters MUST COME FIRST
router.get("/filters", getFilters);

router.get("/featured", getFeaturedProducts);
router.get("/new", getNewArrivalProducts);

// ⭐ Then list products
router.get("/", getProducts);

// ⭐ Must come LAST, because it's dynamic
router.get("/:id", getProductById);

// ==============================
// ADMIN ROUTES
// ==============================
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
