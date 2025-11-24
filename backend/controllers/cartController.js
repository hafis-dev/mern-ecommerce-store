const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==============================
// ADD ITEM TO CART
// ==============================

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    // If no cart, create new cart
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    return res.json({ message: "Added to cart", cart });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET USER CART
// ==============================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images stock"
    );

    if (!cart) return res.json({ items: [] });

    return res.json(cart);
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE CART ITEM
// =============================
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images stock"
    );

    return res.json({ message: "Cart updated", cart: updatedCart });
  } catch (err) {
    console.error("updateCartItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// REMOVE ITEM
// =============================
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images stock"
    );

    return res.json({ message: "Item removed", cart: updatedCart });
  } catch (err) {
    console.error("removeCartItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// CLEAR CART
// =============================
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
