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

router.get("/filters", getFilters);
router.get("/featured", getFeaturedProducts);
router.get("/new", getNewArrivalProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);

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
