const router = require("express").Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const {
  getMyOrders,
  cancelFullOrder,
  updateItemStatus,
  cancelSingleItem,
  updateOrderStatus,
} = require("../controllers/orderController");

// USER ROUTES
router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:orderId", authMiddleware, cancelFullOrder);

// Cancel ONE ITEM
router.put("/cancel-item/:orderId/:itemId", authMiddleware, cancelSingleItem);

// Update ONE ITEM status (Admin)
router.put("/item-status/:orderId/:itemId", adminMiddleware, updateItemStatus);

// Update full order status (Admin)
router.put("/status/:orderId", adminMiddleware, updateOrderStatus);

module.exports = router;
