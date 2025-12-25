import express from "express";

import {
  getWishlist,
  toggleWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/toggle", authMiddleware, toggleWishlist);
router.delete("/clear", authMiddleware, clearWishlist);

export default router;
