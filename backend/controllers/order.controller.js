import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    console.error("getMyOrders error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= CANCEL FULL ORDER ================= */
export const cancelFullOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Delivered orders cannot be cancelled",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    order.status = "Cancelled";
    await order.save();

    return res.json({
      message: "Order cancelled & stock restored",
      order,
    });
  } catch (err) {
    console.error("cancelFullOrder error:", err);
    return res.status(500).json({ message: "Error cancelling order" });
  }
};

/* ================= GET ALL ORDERS (ADMIN) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching orders" });
  }
};

/* ================= UPDATE ORDER STATUS (ADMIN) ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error updating order status" });
  }
};
