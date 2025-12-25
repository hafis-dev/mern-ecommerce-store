import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import Cart from "../models/cart.model.js";
import Wishlist from "../models/wishlist.model.js";
import { uploadToCloudinary } from "../utils/uploadImage.js";

export const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      stock,
      category,
      attributes,
      isFeatured,
      isNewArrival,
      gender,
    } = req.body;

    if (!name || !description || price == null || stock == null || !category) {
      return res.status(400).json({
        message:
          "name, description, price, stock, category are required fields",
      });
    }

    const priceNum = Number(price);
    const stockNum = Number(stock);

    if (isNaN(priceNum) || isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ message: "Invalid price or stock" });
    }

    if (typeof gender === "string") {
      gender = gender.split(",");
    }

    if (!Array.isArray(gender)) {
      gender = [gender];
    }

    gender = gender.map((g) => g.trim());

    if (
      gender.length === 0 ||
      !gender.every((g) => ["Men", "Women"].includes(g))
    ) {
      return res.status(400).json({
        message: "Gender must be ['Men'], ['Women'], or both",
      });
    }

    let finalAttributes = {};
    if (attributes) {
      try {
        const parsed =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        Object.entries(parsed).forEach(([key, value]) => {
          const normalizedKey = key.trim().toLowerCase();
          finalAttributes[normalizedKey] =
            typeof value === "string" ? value.trim() : value;
        });
      } catch (error) {
        finalAttributes = {};
      }
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const product = new Product({
      name: name.trim(),
      description,
      price: priceNum,
      stock: stockNum,
      category,
      gender,
      attributes: finalAttributes,
      images: imageUrls,
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false,
    });

    await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("createProduct error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    let { category, sort, minPrice, maxPrice, search, gender, ...attrs } =
      req.query;

    const query = {};

    if (category) query.category = category;

    if (gender) {
      let genderArray = gender;

      if (typeof genderArray === "string") {
        genderArray = genderArray.split(",");
      }

      if (!Array.isArray(genderArray)) {
        genderArray = [genderArray];
      }

      query.gender = { $all: genderArray };

      delete attrs.gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ];
    }

    Object.keys(attrs).forEach((key) => {
      if (attrs[key]) {
        query[`attributes.${key}`] = attrs[key];
      }
    });

    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    const products = await Product.find(query).sort(sortObj).lean();

    return res.json({
      total: products.length,
      products,
    });
  } catch (err) {
    console.error("getProducts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ product });
  } catch (err) {
    console.error("getProductById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({ products });
  } catch (err) {
    console.error("getFeaturedProducts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({ products });
  } catch (err) {
    console.error("getNewArrivalProducts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "category",
      "gender",
      "attributes",
      "isFeatured",
      "isNewArrival",
    ];

    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (
        allowedFields.includes(key) &&
        key !== "attributes" &&
        key !== "gender"
      ) {
        updates[key] = req.body[key];
      }
    });

    if ("gender" in req.body) {
      let g = req.body.gender;

      if (typeof g === "string") {
        g = g.split(",");
      }

      if (
        !Array.isArray(g) ||
        g.length === 0 ||
        !g.every((v) => ["Men", "Women"].includes(v))
      ) {
        return res.status(400).json({
          message: "Gender must be ['Men'], ['Women'], or ['Men','Women']",
        });
      }

      updates.gender = g;
    }

    if ("attributes" in req.body) {
      let finalAttributes = {};

      try {
        const raw =
          typeof req.body.attributes === "string"
            ? JSON.parse(req.body.attributes)
            : req.body.attributes;

        Object.entries(raw).forEach(([key, value]) => {
          const normalizedKey = key.trim().toLowerCase();
          finalAttributes[normalizedKey] =
            typeof value === "string" ? value.trim() : value;
        });
      } catch (err) {
        finalAttributes = existingProduct.attributes;
      }

      updates.attributes = finalAttributes;
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    let finalImages = existingProduct.images;

    if (req.body.removeImages) {
      try {
        const removeIdx = JSON.parse(req.body.removeImages);
        finalImages = finalImages.filter((_, idx) => !removeIdx.includes(idx));
      } catch (err) {}
    }

    if (req.files && req.files.length > 0) {
      const upload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce_products" },
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
          );
          stream.end(buffer);
        });

      const uploaded = await Promise.all(
        req.files.map((file) => upload(file.buffer))
      );

      finalImages = [...finalImages, ...uploaded];
    }

    updates.images = finalImages;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("updateProduct error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Cart.updateMany(
      { "items.product": id },
      { $pull: { items: { product: id } } }
    );

    await Wishlist.updateMany({ products: id }, { $pull: { products: id } });

    return res.json({
      message: "Product deleted and removed from carts & wishlists",
      product: deleted,
    });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const normalizeKey = (key) => key.trim().toLowerCase();

export const getFilters = async (req, res) => {
  try {
    const products = await Product.find();
    const filters = {};

    products.forEach((p) => {
      const category = p.category;

      if (!filters[category]) {
        filters[category] = {};
      }
      const attributeArray = Object.entries(p.attributes || {});
      attributeArray.forEach(([key, value]) => {
        const cleanKey = normalizeKey(key);

        if (!filters[category][cleanKey]) {
          filters[category][cleanKey] = new Set();
        }

        filters[category][cleanKey].add(value);
      });
    });

    const finalFilters = {};
    const filterArray = Object.entries(filters);

    filterArray.forEach(([cat, attrs]) => {
      finalFilters[cat] = {};
      Object.entries(attrs).forEach(([attr, values]) => {
        finalFilters[cat][attr] = Array.from(values);
      });
    });

    return res.json(finalFilters);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load filters" });
  }
};
