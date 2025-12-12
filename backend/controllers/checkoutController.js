const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      userName: req.user.username,
      orderItems: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price * item.quantity,
        image: item.product.images[0],
      })),
      shippingAddress,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      status: "Processing",
    });

    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    return res.json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
