const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products"
    );

    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }

    const validProducts = wishlist.products.filter((p) => p !== null);

    if (validProducts.length !== wishlist.products.length) {
      wishlist.products = validProducts.map((p) => p._id);
      await wishlist.save();
    }

    return res.status(200).json({ products: validProducts });
  } catch (error) {
    console.error("getWishlist error:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });

      return res.status(201).json({
        message: "Added to wishlist",
        wishlist,
      });
    }

    const isExists = wishlist.products.includes(productId);

    if (isExists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();

      return res.status(200).json({
        message: "Removed from wishlist",
        wishlist,
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Wishlist update failed" });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user.id }, { products: [] });

    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear wishlist" });
  }
};
