import express from "express";
import upload from "../middleware/multer.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivalProducts,
  getFilters,
} from "../controllers/product.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";

const router = express.Router();

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

export default router;
