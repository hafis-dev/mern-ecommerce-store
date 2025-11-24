const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { createOrder } = require("../controllers/checkoutController");

router.post("/place", authMiddleware, createOrder);

module.exports = router;
