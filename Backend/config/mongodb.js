import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongoDB = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
      });
  } catch (err) {
    console.error("Error in Processing connection request", err.message);
  }
};

export default connectMongoDB;
