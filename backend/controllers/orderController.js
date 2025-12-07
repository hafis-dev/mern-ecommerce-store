const Order = require("../models/Order");
const Product = require("../models/Product");
// USER: Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// USER: Cancel full order
exports.cancelFullOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // If already cancelled or delivered, prevent duplicate stock updates
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    // Restore stock for each item
    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.qty } } // Increase stock back
      );
    }

    // Cancel the order
    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled & stock restored", order });
  } catch (err) {
    console.error("cancelFullOrder error:", err);
    res.status(500).json({ message: "Error cancelling order" });
  }
};


// ADMIN: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// ADMIN: Update FULL ORDER status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order status" });
  }
};
