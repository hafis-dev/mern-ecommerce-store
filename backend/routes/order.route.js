const router = require("express").Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");

const {
  getMyOrders,
  cancelFullOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/order.controller");

router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:orderId", authMiddleware, cancelFullOrder);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put(
  "/status/:orderId",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;
