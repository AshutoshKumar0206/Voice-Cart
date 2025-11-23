import express from "express";
import createMulterInstance from "../utils/multer.js";
import {
  getAllProducts,
  createProduct,
  getProductById,
  getProductsByTopDeals,
  exploreProducts,
  getProductsByCategory,
} from "../controllers/productsController.js";

const router = express.Router();

const productUploader = createMulterInstance("uploads/products");

router.post("/createProduct", productUploader.single("image"), createProduct);

router.get("/getAllProducts", getAllProducts);

router.get("/getProductById/:id", getProductById);

router.get("/getTopDeals", getProductsByTopDeals);

router.get("/exploreProducts", exploreProducts);

router.get("/getProductsByCategory/:category", getProductsByCategory);

export default router;
