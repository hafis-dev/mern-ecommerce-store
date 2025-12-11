// backend/controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const Cart = require("../models/Cart");
const { uploadToCloudinary } = require("../utils/uploadImage");

// =====================================================
// CREATE PRODUCT (Admin)
// =====================================================
exports.createProduct = async (req, res) => {
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

    // BASIC VALIDATION
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

    // ⭐ FIX 1 — ALWAYS CONVERT GENDER TO ARRAY
    if (typeof gender === "string") {
      // Handles: "Men" or "Women" or "Men,Women"
      gender = gender.split(",");
    }

    if (!Array.isArray(gender)) {
      gender = [gender];
    }

    // ⭐ FIX 2 — VALIDATE ARRAY CONTENT
    gender = gender.map((g) => g.trim());

    if (
      gender.length === 0 ||
      !gender.every((g) => ["Men", "Women"].includes(g))
    ) {
      return res.status(400).json({
        message: "Gender must be ['Men'], ['Women'], or both",
      });
    }

    // NORMALIZE ATTRIBUTE KEYS
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

    // IMAGES REQUIRED
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    // UPLOAD IMAGES TO CLOUDINARY
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    // CREATE PRODUCT
    const product = new Product({
      name: name.trim(),
      description,
      price: priceNum,
      stock: stockNum,
      category,
      gender, // NOW ALWAYS ARRAY
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


// =====================================================
// ADVANCED FILTERING (Public)
// =====================================================
exports.getProducts = async (req, res) => {
  try {
    let { category, sort, minPrice, maxPrice, search, gender, ...attrs } =
      req.query;

    const query = {};

    // CATEGORY FILTER
    if (category) query.category = category;

    // ⭐ GENDER FILTER (ARRAY SAFE)
    // ⭐ FIXED GENDER FILTER (WORKS WITH BOTH SELECTION)
    if (gender) {
      let genderArray = gender;

      // Convert "Men,Women" → ["Men", "Women"]
      if (typeof genderArray === "string") {
        genderArray = genderArray.split(",");
      }

      // Ensure array
      if (!Array.isArray(genderArray)) {
        genderArray = [genderArray];
      }

      // ⭐ FIXED → match ALL selected genders, not ANY
      query.gender = { $all: genderArray };

      delete attrs.gender;
    }


    // PRICE RANGE FILTER
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

    // DYNAMIC ATTRIBUTE FILTERING
    Object.keys(attrs).forEach((key) => {
      if (attrs[key]) {
        query[`attributes.${key}`] = attrs[key];
      }
    });

    // SORTING
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

// =====================================================
// GET PRODUCT BY ID
// =====================================================
exports.getProductById = async (req, res) => {
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

// =====================================================
// GET FEATURED PRODUCTS
// =====================================================
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

// =====================================================
// GET NEW ARRIVALS
// =====================================================
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
// UPDATE PRODUCT (Admin)
// ==============================
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Allowed fields for update
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

    // Apply basic updates
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key) && key !== "attributes" && key !== "gender") {
        updates[key] = req.body[key];
      }
    });

    // ⭐ FIX: Parse gender correctly from FormData
    if ("gender" in req.body) {
      let g = req.body.gender;

      // Case 1: Single gender → "Men"
      // Case 2: Both genders → "Men,Women"
      if (typeof g === "string") {
        g = g.split(","); // convert string to array
      }

      // Validation
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

    // ⭐ Normalize attributes
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

    // Convert numeric fields
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    // ============================
    // IMAGE HANDLING
    // ============================
    let finalImages = existingProduct.images;

    // Remove images
    if (req.body.removeImages) {
      try {
        const removeIdx = JSON.parse(req.body.removeImages);
        finalImages = finalImages.filter((_, idx) => !removeIdx.includes(idx));
      } catch (err) {
        console.log("Failed to parse removeImages:", err);
      }
    }

    // Add new images
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

    // ============================
    // SAVE UPDATED PRODUCT
    // ============================
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


// =====================================================
// DELETE PRODUCT
// =====================================================
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    await Cart.updateMany(
      { "items.product": id },
      { $pull: { items: { product: id } } }
    );

    return res.json({
      message: "Product deleted and removed from all carts",
      product: deleted,
    });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// FILTER GENERATION (for frontend sidebar)
// =====================================================
const normalizeKey = (key) => key.trim().toLowerCase();

exports.getFilters = async (req, res) => {
  try {
    const products = await Product.find();
    const filters = {};

    products.forEach((p) => {
      const category = p.category;

      if (!filters[category]) {
        filters[category] = { gender: new Set() };
      }

      // ⭐ GENDER FILTER (array-friendly)
      if (Array.isArray(p.gender)) {
        p.gender.forEach((g) => filters[category].gender.add(g));
      }

      // ATTRIBUTE FILTERS
      Object.entries(p.attributes || {}).forEach(([key, value]) => {
        const cleanKey = normalizeKey(key);

        if (!filters[category][cleanKey]) {
          filters[category][cleanKey] = new Set();
        }

        filters[category][cleanKey].add(value);
      });
    });

    // Convert Sets → Arrays
    const finalFilters = {};
    Object.entries(filters).forEach(([cat, attrs]) => {
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
