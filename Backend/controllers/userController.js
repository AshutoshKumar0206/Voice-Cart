import userModel from "../model/user.js";
import Product from "../model/product.js";
import OTP from "../model/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import notConfirmedModel from "../model/notConfirmed.js";
import pendingUserModel from "../model/pendingUser.js";
import Cart from "../model/cart.js";
import mongoose from "mongoose";
import { emailQueue } from "../utils/queue.js";
import axios from "axios";

/* ============================
      SIGN UP
============================ */
export const signUp = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8+ chars, with uppercase, lowercase, number, and special char.",
      });
    }

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const savedUser = await newUser.save();

    // OTP GENERATED
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP in DB
    await OTP.create({ email, otp });

    // Send OTP through queue
    await emailQueue.add(
      "sendOtp",
      { email, otp, name },
      { removeOnComplete: true, removeOnFail: 100 }
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully & OTP queued",
      user: savedUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to create user" });
  }
};

/* 
  RESEND OTP
*/
export const resendOtp = async (req, res) => {
  console.log(req.body);
  const {email} = req.body;
  
  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
  await OTP.updateOne({ email }, { otp, createdAt: new Date() }, { upsert: true });
  await emailQueue.add("sendOtp", { email, otp, name: user.name });
  return res.status(200).json({ success: true, message: "OTP resent successfully" });
};

/* ============================
      SIGN IN
============================ */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.token = token;
    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      token,
      user,
      message: "User Login Success",
    });
  } catch (error) {
    console.log("Error in signIn:", error);
    res.status(500).json({
      success: false,
      message: "Unable to signIn user",
    });
  }
};

/* ============================
      VERIFY OTP
============================ */
export const verifyotp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email)
      return res.status(400).json({
        success: false,
        message: "OTP and email are required",
      });

    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry)
      return res.status(401).json({ message: "Invalid OTP." });

    const currUser = await notConfirmedModel.findOne({ email });
    if (!currUser)
      return res.status(404).json({
        message: "User not found in notConfirmed list.",
      });

    const approvedUser = new pendingUserModel({
      name: currUser.firstName,
      email: currUser.email,
      password: currUser.password,
    });

    await approvedUser.save();
    await notConfirmedModel.findByIdAndDelete(currUser._id);
    await OTP.deleteOne({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (err) {
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ============================
      LOGOUT
============================ */
export const logout = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });

    res.clearCookie("token");

    res.status(200).json({
      message: "User Logged out",
    });
  } catch (err) {
    next(err);
  }
};

/* ============================
      DASHBOARD
============================ */
export const dashboard = async (req, res) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id)
      return res.status(404).json({
        success: false,
        message: "Unauthorized",
      });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });

    const user = await userModel
      .findById(id)
      .select("-password")
      .populate({
        path: "orders",
        populate: {
          path: "items.product",
          model: "product",
          select: "product_name price description category",
        },
      })
      .exec();

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

/* ============================
      GET ME
============================ */
export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user in request",
      });
    }

    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select("-password")
      .populate({
        path: "orders",
        populate: {
          path: "items.product",
          model: "product",
          select: "product_name price images category description",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        orders: user.orders.map(order => ({
          orderId: order._id,
          status: order.status,
          totalAmount: order.totalAmount,
          deliveredAt: order.deliveredAt,
          reviewed: order.reviewed,
          createdAt: order.createdAt,
          items: order.items.map(item => ({
            productId: item.product?._id ?? null,
            productName: item.product?.product_name ?? null,
            price: item.product?.price ?? null,
            quantity: item.quantity,
            category: item.product?.category ?? null,
            image: item.product?.images?.[0] ?? null,
          })),
        })),
      },
    });
  } catch (err) {
    console.error("getMe Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user details",
    });
  }
};

/* ============================
      PRODUCT RECOMMENDATION
============================ */
export const recommendProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Ensure user exists & has a cart — optional check
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      console.log("No cart found for user — still recommending based on behavior model");
    }

    // STEP 1: request recommendations from Flask SVD service
    console.log("Sending request → Flask model:", userId);

    const flaskResponse = await axios.get("http://127.0.0.1:5000/recommend", {
      params: { user_id: userId, n: 10 },
    });

    const recommendedList = flaskResponse.data.recommendations;

    if (!recommendedList || recommendedList.length === 0) {
      return res.status(200).json({
        success: true,
        recommendedProducts: [],
        message: "No recommendations generated",
      });
    }

    // recommendedList contains product entries from products.csv
    // e.g. [{product_id:name, category, price, ...}]

    const productIds = recommendedList.map(item => item.product_id);

    // STEP 2: Fetch actual MongoDB product objects
    const mongoProducts = await Product.find({ product_id: { $in: productIds } });

    // STEP 3: Return final merged recommendations
    return res.status(200).json({
      success: true,
      recommendedProducts: mongoProducts,
    });

  } catch (error) {
    console.error("Recommendation Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch recommendations",
    });
  }
};
