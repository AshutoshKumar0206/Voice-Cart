import Product from "../model/product.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

/* ============================
      CREATE PRODUCT
============================ */
export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      price,
      description,
      quantity,
      category,
      subCategory,
      brand,
      discount,
      tags,
      metadata,
    } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!product_name || !price || !description || !quantity || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    /* ---------- IMAGE REQUIRED ---------- */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    /* ---------- UPLOAD IMAGE ---------- */
    const imageUpload = await uploadImageToCloudinary(
      req.file,
      process.env.FOLDER,
      1000,
      1000
    );

    /* ---------- PARSE OPTIONAL FIELDS ---------- */
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags); // expects tags as JSON string array
      } catch {
        parsedTags = [tags]; // if single string
      }
    }

    let parsedMetadata = {};
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch {
        parsedMetadata = {};
      }
    }

    /* ---------- CREATE PRODUCT ---------- */
    const newProduct = await Product.create({
      product_name,
      price,
      description,
      category,
      subCategory: subCategory || "",
      brand: brand || "",
      quantity,
      discount: discount || undefined,
      metadata: parsedMetadata,
      tags: parsedTags,
      image: imageUpload.secure_url,
      inStock: quantity > 0,
      avgRating: 0,
      ratingCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
};

/* ============================
      GET ALL PRODUCTS
============================ */
export const getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

/* ============================
      GET PRODUCT BY ID
============================ */
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const productData = await Product.findById(productId);

    if (!productData) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      productData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

/* ============================
      UPDATE PRODUCT RATING
============================ */
export const updateProductRating = async (req, res) => {
  try {
    const { productId, rating } = req.body;

    if (!productId || rating == null)
      return res.status(400).json({ success: false, message: "Product ID and rating are required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // Calculate new average rating
    product.avgRating = ((product.avgRating * product.ratingCount) + rating) / (product.ratingCount + 1);
    product.ratingCount += 1;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product rating updated successfully",
      product,
    });
  } catch (err) {
    console.error("Error updating rating:", err);
    res.status(500).json({ success: false, message: "Unable to update rating" });
  }
};

/* ============================
      UPDATE PRODUCT STOCK
============================ */
export const updateProductStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null)
      return res.status(400).json({ success: false, message: "Product ID and quantity are required" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    product.quantity = quantity;
    product.inStock = quantity > 0;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product stock updated",
      product,
    });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ success: false, message: "Unable to update stock" });
  }
};

/* ============================
      GET TOP DEALS (RANDOM 5)
============================ */
export const getProductsByTopDeals = async (req, res) => {
  try {
    const topDeals = await Product.aggregate([{ $sample: { size: 5 } }]);

    if (!topDeals || topDeals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No top deals found",
      });
    }

    res.status(200).json({
      success: true,
      topDeals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch top deals",
    });
  }
};

/* ============================
      EXPLORE PRODUCTS (RANDOM 8)
============================ */
export const exploreProducts = async (req, res) => {
  try {
    const exploredProducts = await Product.aggregate([
      { $sample: { size: 8 } },
    ]);

    if (!exploredProducts || exploredProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      exploredProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch required products",
    });
  }
};

/* ============================
      GET PRODUCTS BY CATEGORY
============================ */
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const totalProducts = await Product.countDocuments({ category });
    const categoryProducts = await Product.find({ category })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products: categoryProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch products by category",
    });
  }
};
