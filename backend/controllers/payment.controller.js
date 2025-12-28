import stripe from "../config/stripe.js";
import Cart from "../models/cart.model.js";

export const createStripeSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.images || [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        userId: userId.toString(),
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || "India",
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ message: "Stripe error" });
  }
};
