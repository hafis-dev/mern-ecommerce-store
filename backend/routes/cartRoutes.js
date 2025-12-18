const { addToCart, getCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/cartController");
const {authMiddleware} = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post('/add',authMiddleware , addToCart)
router.get("/", authMiddleware, getCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/remove/:productId", authMiddleware, removeCartItem);
router.delete("/clear", authMiddleware, clearCart);
module.exports=router;