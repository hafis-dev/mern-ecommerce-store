import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { createOrder } from "../controllers/checkout.controller.js";

const router = express.Router();

router.post("/place", authMiddleware, createOrder);

export default router;
