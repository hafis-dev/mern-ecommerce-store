// backend/controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require('../config/cloudinary');
const Cart = require('../models/Cart');
const { uploadToCloudinary } = require("../utils/uploadImage");

// ==============================
// CREATE PRODUCT (Admin)
// ==============================

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      attributes,
      isFeatured,
      isNewArrival,
    } = req.body;

    // ----- BASIC VALIDATION ------
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

    // ----- NORMALIZE ATTRIBUTES (lowercase keys) -----
    let finalAttributes = {};

    if (attributes) {
      try {
        const parsed =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        Object.entries(parsed).forEach(([key, value]) => {
          const normalizedKey = key.trim().toLowerCase(); // lowercase the key
          finalAttributes[normalizedKey] =
            typeof value === "string" ? value.trim() : value;
        });
      } catch (error) {
        finalAttributes = {};
      }
    }

    // Images required
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    // ----------------------------
    // CLOUDINARY BUFFER UPLOAD
    // ----------------------------
  

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    // ----- CREATE PRODUCT -----
    const product = new Product({
      name: name.trim(),
      description,
      price: priceNum,
      stock: stockNum,
      category,
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


// ==============================
// ADVANCED FILTERING (Public)
// ==============================
exports.getProducts = async (req, res) => {
  try {
    let { category, sort, minPrice, maxPrice, search, ...attrs } = req.query;

    const query = {};

    // CATEGORY FILTER
    if (category) query.category = category;

    // PRICE FILTER
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // SEARCH FILTER
    if (search) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ];
    }

    // ATTRIBUTE FILTERS
    Object.keys(attrs).forEach((key) => {
      if (
        attrs[key] !== "" &&
        attrs[key] !== undefined &&
        attrs[key] !== null
      ) {
        query[`attributes.${key}`] = attrs[key];
      }
    });

    // SORTING
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    // 🚀 FETCH ALL PRODUCTS — NO PAGINATION
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


// ==============================
// GET PRODUCT BY ID
// ==============================
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ product });
  } catch (err) {
    console.error("getProductById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// ==============================
// GET FEATURED PRODUCTS
// ==============================
exports.getFeaturedProducts = async (req, res) => {
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


// ==============================
// GET NEW ARRIVAL PRODUCTS
// ==============================
exports.getNewArrivalProducts = async (req, res) => {
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
// ==============================
// ==============================
// UPDATE PRODUCT (Admin)
// ==============================
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Fetch the existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Allowed fields
    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "category",
      "attributes",
      "isFeatured",
      "isNewArrival",
    ];

    const updates = {};

    // Assign only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        if (key === "attributes") {
          try {
            updates.attributes = JSON.parse(req.body.attributes);
          } catch {
            updates.attributes = existingProduct.attributes;
          }
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    // Convert price/stock to numbers
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    // Upload new images if provided
    let finalImages = existingProduct.images; // default = keep old images

    if (req.files && req.files.length > 0) {
      const uploadBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { folder: "ecommerce_products" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          upload.end(fileBuffer);
        });
      };

      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadBuffer(file.buffer))
      );

      finalImages = uploadedImages; // replace images
    }

    updates.images = finalImages;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
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


// ==============================
// DELETE PRODUCT (Admin)
// ==============================
// ==============================
// DELETE PRODUCT (Admin)
// ==============================
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check valid ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // 2. DELETE PRODUCT
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // If not found
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ==============================================================
    // 3. CRITICAL FIX: CLEANUP CARTS
    // Remove this specific product from the 'items' array in ALL carts
    // ==============================================================
    await Cart.updateMany(
      { "items.product": productId },              // Find carts that have this product
      { $pull: { items: { product: productId } } } // Pull (remove) the item from the array
    );

    return res.json({
      message: "Product deleted and removed from all active carts",
      product: deletedProduct,
    });

  } catch (err) {
    console.error("deleteProduct error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};





// Normalization map (use same keys everywhere)
const normalizeKey = (key) => {
  return key.trim().toLowerCase(); // shape → shape, Brand → brand, COLOR → color
};

exports.getFilters = async (req, res) => {
  try {
    const products = await Product.find();

    const filters = {};

    products.forEach((p) => {
      const category = p.category;

      if (!filters[category]) {
        filters[category] = {};
      }

      Object.entries(p.attributes || {}).forEach(([key, value]) => {

        // 🔥 Normalize attribute key
        const cleanKey = normalizeKey(key);

        if (!filters[category][cleanKey]) {
          filters[category][cleanKey] = new Set();
        }

        filters[category][cleanKey].add(value);
      });
    });

    // Convert Set -> Array
    const finalFilters = {};
    Object.entries(filters).forEach(([category, attrs]) => {
      finalFilters[category] = {};
      Object.entries(attrs).forEach(([attr, values]) => {
        finalFilters[category][attr] = Array.from(values);
      });
    });

    res.json(finalFilters);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load filters" });
  }
};

