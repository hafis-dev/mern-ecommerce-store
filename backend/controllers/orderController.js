const Order = require("../models/Order");
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

exports.cancelFullOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 👉 1. Cancel whole order
    order.status = "Cancelled";

    // 👉 2. Cancel all items inside the order
    order.orderItems.forEach((item) => {
      item.itemStatus = "Cancelled";
    });

    // 👉 3. Set total price to 0 (optional)
    order.totalPrice = 0;

    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling order" });
  }
};


exports.cancelSingleItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.orderItems.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Cancel item
    item.itemStatus = "Cancelled";

    // Reduce price
    order.totalPrice -= item.qty * item.price;

    await order.save();

    res.json({ message: "Item cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling item" });
  }
};




exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};
exports.updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.orderItems.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.itemStatus = status;

    await order.save();

    res.json({ message: "Item status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating item status" });
  }
};

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
