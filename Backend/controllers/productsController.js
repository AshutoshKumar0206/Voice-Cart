import Product from "../model/product.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

/* ============================
      CREATE PRODUCT
============================ */
export const createProduct = async (req, res) => {
  try {
    const { product_name, price, description, quantity, category } = req.body;

    if (!product_name || !price || !description || !quantity || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const imageUpload = await uploadImageToCloudinary(
      req.file,
      process.env.FOLDER,
      1000,
      1000
    );

    const newProduct = await Product.create({
      product_name,
      price,
      description,
      category,
      quantity,
      image: imageUpload.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
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
