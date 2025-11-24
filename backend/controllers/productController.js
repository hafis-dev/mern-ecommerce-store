// backend/controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require('../config/cloudinary');

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

    // Parse attributes string → JSON
    let finalAttributes = {};
    if (attributes) {
      try {
        finalAttributes = JSON.parse(attributes);
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
    const uploadBuffer = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "ecommerce_products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        upload.end(fileBuffer);
      });
    };

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadBuffer(file.buffer))
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
    let {
      page = 1,
      limit = 10,
      category,
      sort,
      minPrice,
      maxPrice,
      search,
      ...attrs
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    // ---------------------------
    // CATEGORY FILTER
    // ---------------------------
    if (category) query.category = category;

    // ---------------------------
    // PRICE FILTER (min & max)
    // ---------------------------
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ---------------------------
    // SEARCH FILTER
    // ---------------------------
    if (search) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ];
    }

    // ---------------------------
    // DYNAMIC ATTRIBUTE FILTERS
    // Example: ?brand=Nike&size=10&color=Black
    // ---------------------------
    Object.keys(attrs).forEach((key) => {
      // ignore empty filters (important)
      if (
        attrs[key] !== "" &&
        attrs[key] !== undefined &&
        attrs[key] !== null
      ) {
        query[`attributes.${key}`] = attrs[key];
      }
    });

    // ---------------------------
    // SORTING
    // ---------------------------
    let sortObj = { createdAt: -1 }; // default = newest first
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    // ---------------------------
    // FETCH WITH PAGINATION
    // ---------------------------
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      total,
      page,
      limit,
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
// ==============================
// UPDATE PRODUCT (Admin)
// ==============================
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate MongoDB ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Allowed fields for update
    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "category",
      "attributes",
      "images",
      "isFeatured",
      "isNewArrival",
    ];

    const updates = {};

    // Loop through body and accept only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate stock if provided
    if (updates.stock !== undefined) {
      const stockNum = Number(updates.stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ message: "Invalid stock value" });
      }
      updates.stock = stockNum;
    }

    // Validate price if provided
    if (updates.price !== undefined) {
      const priceNum = Number(updates.price);
      if (isNaN(priceNum)) {
        return res.status(400).json({ message: "Invalid price value" });
      }
      updates.price = priceNum;
    }

    // Trim name if provided
    if (updates.name) {
      updates.name = updates.name.trim();
    }

    // Attributes must be object (optional)
    if (updates.attributes && typeof updates.attributes !== "object") {
      return res.status(400).json({ message: "Attributes must be an object" });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true } // return updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

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
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check valid ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Delete product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // If not found
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
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
