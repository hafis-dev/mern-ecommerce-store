import express from "express";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";

import {
  getMyOrders,
  cancelFullOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:orderId", authMiddleware, cancelFullOrder);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put(
  "/status/:orderId",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

export default router;
