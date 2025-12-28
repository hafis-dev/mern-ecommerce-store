import stripe from "../config/stripe.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata?.userId;
      if (!userId) return res.json({ received: true });

      
      const existingOrder = await Order.findOne({
        "paymentResult.paymentId": session.payment_intent,
      });

      if (existingOrder) {
        console.log("🔁 Duplicate webhook ignored");
        return res.json({ received: true });
      }

     const cart = await Cart.findOne({ user: userId }).populate(
       "items.product"
     );
     const user = await User.findById(userId).select("username");

      if (!cart || cart.items.length === 0) {
        return res.json({ received: true });
      }

      const order = await Order.create({
        user: userId,
        userName: user.username,
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          qty: item.quantity,
          price: item.product.price * item.quantity,
          image: item.product.images?.[0],
        })),
        shippingAddress: {
          phone: session.metadata.phone,
          street: session.metadata.street,
          city: session.metadata.city,
          state: session.metadata.state,
          zipCode: session.metadata.zipCode,
          country: session.metadata.country || "India",
        },

        totalPrice: session.amount_total / 100, 
        isPaid: true,
        paidAt: Date.now(),
        status: "Processing",
        paymentResult: {
          paymentId: session.payment_intent,
          orderId: session.id,
          status: session.payment_status,
          email_address: session.customer_details?.email,
        },
      });

      
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty },
        });
      }

      
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });

      console.log("✅ Order created via Stripe webhook:", order._id);
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
    }
  }

  res.json({ received: true });
};
