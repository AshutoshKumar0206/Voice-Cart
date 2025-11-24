import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Product from "./model/product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/yourdb";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const exportProductsCSV = async () => {
  try {
    const products = await Product.find({});

    const csvLines = products.map(prod => {
      return `"${prod._id}","${prod.product_name}","${prod.category || ''}","${prod.subCategory || ''}",${prod.price || 0},"${prod.description || ''}",${prod.avgRating || 0},${prod.ratingCount || 0}`;
    });

    const csvContent = "prod_id,product_name,category,subCategory,price,description,avgRating,ratingCount\n" + csvLines.join("\n");

    fs.writeFileSync("products.csv", csvContent);
    console.log("CSV file created: products.csv");
    process.exit();
  } catch (err) {
    console.error("Error generating products CSV:", err);
    process.exit(1);
  }
};

exportProductsCSV();
