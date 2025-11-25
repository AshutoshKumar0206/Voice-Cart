import express from "express";
import { placeOrder, getOrders } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/placeOrder", isAuthenticated, placeOrder);
router.get("/getOrders", isAuthenticated, getOrders);

export default router;
