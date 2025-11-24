const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getMyOrders, cancelOrder } = require("../controllers/orderController");

router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:id", authMiddleware, cancelOrder);

module.exports = router;
