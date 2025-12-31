import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

export default router;
