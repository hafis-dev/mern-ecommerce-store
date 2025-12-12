const router = require("express").Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const {
  getMyOrders,
  cancelFullOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:orderId", authMiddleware, cancelFullOrder);

router.get("/", authMiddleware, adminMiddleware, getAllOrders); // 🔥 NEW
router.put("/status/:orderId",authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
