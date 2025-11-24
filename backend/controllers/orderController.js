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


exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // User can only cancel his own order
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // User cannot cancel shipped or delivered orders
    if (order.status !== "Processing") {
      return res.status(400).json({
        message: "You can cancel only Processing orders",
      });
    }

    order.status = "Cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log("cancelOrder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
