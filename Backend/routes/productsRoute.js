import express from "express";
import createMulterInstance from "../utils/multer.js";
import {
  getAllProducts,
  createProduct,
  getProductById,
  getProductsByTopDeals,
  exploreProducts,
  getProductsByCategory,
  updateProductRating,
  updateProductStock,
} from "../controllers/productsController.js";

const router = express.Router();

const productUploader = createMulterInstance("uploads/products");

// Product creation
router.post("/createProduct", productUploader.single("image"), createProduct);

// Get products
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:id", getProductById);
router.get("/getTopDeals", getProductsByTopDeals);
router.get("/exploreProducts", exploreProducts);
router.get("/getProductsByCategory/:category", getProductsByCategory);

// Update product rating
router.post("/updateRating", updateProductRating);

// Update product stock
router.post("/updateStock", updateProductStock);

export default router;
