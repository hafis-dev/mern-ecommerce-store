const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Snapshot of user name
    userName: { type: String, required: true },

    // Items purchased
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        qty: Number,
        price: Number,
        image: String,

        // NEW
        itemStatus: {
          type: String,
          enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
          default: "Processing",
        },

       
      },
    ],

    // Shipping snapshot
    shippingAddress: {
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    // Payment details
    paymentResult: {
      paymentId: { type: String }, // Razorpay/Stripe payment Id
      orderId: { type: String }, // Razorpay/Stripe order Id
      status: { type: String }, // “success”
      email_address: { type: String },
    },

    // Total order price
    totalPrice: { type: Number, required: true },

    // Payment status
    isPaid: { type: Boolean, default: true },
    paidAt: { type: Date, default: Date.now },

    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
