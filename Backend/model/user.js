import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    token: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],

    ratings: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    preferences: [{ type: String }],
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
