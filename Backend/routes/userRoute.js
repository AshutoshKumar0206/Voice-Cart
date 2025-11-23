import express from "express";
import {
  signUp,
  signIn,
  logout,
  verifyotp,
  dashboard,
  getMe,
  recommendProducts,
  resendOtp
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Authentication Routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", isAuthenticated, logout);

// OTP Routes
router.post("/verify-otp", verifyotp);
router.post('/resend-otp', resendOtp);

// User Dashboard Route
router.get("/dashboard/:id", isAuthenticated, dashboard);

// Get Current User Route
router.get("/me", isAuthenticated, getMe);

// Get Recommended Products
router.get("/recommendProducts/:id", isAuthenticated, recommendProducts);

export default router;
