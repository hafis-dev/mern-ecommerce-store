import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createStripeSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/stripe-session", authMiddleware, createStripeSession);

export default router;
