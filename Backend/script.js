import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/product.js"; // adjust path to your Product model

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/yourdb";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const printProductNames = async () => {
  try {
    const products = await Product.find({}, { product_name: 1, _id: 0 }); // fetch only product_name
    console.log("Products:");
    products.forEach((prod, idx) => {
      console.log(`${idx + 1}. ${prod.product_name}`);
    });
    process.exit();
  } catch (err) {
    console.error("Error fetching product names:", err);
    process.exit(1);
  }
};

printProductNames();
