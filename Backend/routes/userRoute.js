const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/auth.middleware");

//User Authentication Routes
router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/logout", isAuthenticated, userController.logout);

// OTP Routes
router.post("/sendotp", userController.sendotp);
router.post("/verifyotp", userController.verifyotp);

// User Dashboard Route
router.get("/dashboard/:id",isAuthenticated, userController.dashboard);

module.exports = router;