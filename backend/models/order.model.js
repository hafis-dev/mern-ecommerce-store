import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

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
      },
    ],

    shippingAddress: {
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    paymentResult: {
      paymentId: String,
      orderId: String,
      status: String,
      email_address: String,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  
  if (
    this.isModified("status") &&
    this.status === "Delivered" &&
    this.paymentResult?.status === "COD" &&
    !this.isPaid
  ) {
    this.isPaid = true;
    this.paidAt = new Date();
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
