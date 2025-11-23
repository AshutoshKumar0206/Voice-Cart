import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addToCart/:id", isAuthenticated, addToCart);
router.get("/getCart/:id", isAuthenticated, getCart);
router.put("/updateCart/:id", isAuthenticated, updateCart);
router.delete("/removeFromCart", isAuthenticated, removeFromCart);

export default router;
