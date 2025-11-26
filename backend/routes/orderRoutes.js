const router = require("express").Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const {
  getMyOrders,
  cancelFullOrder,
  cancelSingleItem,
  updateItemStatus,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

// USER ROUTES
router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:orderId", authMiddleware, cancelFullOrder);

// ADMIN ROUTES
router.get("/", authMiddleware, adminMiddleware, getAllOrders); // 🔥 NEW
router.put("/status/:orderId",authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
