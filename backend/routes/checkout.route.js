const router = require("express").Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { createOrder } = require("../controllers/checkout.controller");

router.post("/place", authMiddleware, createOrder);

module.exports = router;
