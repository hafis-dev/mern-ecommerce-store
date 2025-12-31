import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";


export const getWishlist = async (req, res) => {
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
    return res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};


export const toggleWishlist = async (req, res) => {
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

    const isExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

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

    return res.status(200).json({
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("toggleWishlist error:", error);
    return res.status(500).json({ message: "Wishlist update failed" });
  }
};


export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user.id }, { products: [] });

    return res.status(200).json({
      message: "Wishlist cleared",
    });
  } catch (error) {
    console.error("clearWishlist error:", error);
    return res.status(500).json({ message: "Failed to clear wishlist" });
  }
};
