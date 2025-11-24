import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number },
        rating: { type: Number, min: 1, max: 5, default: null },
      },
    ],
    deliveredAt: { type: Date },
    reviewed: { type: Boolean, default: false },

    totalAmount: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["Processing", "Delivered"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);
