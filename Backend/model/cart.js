import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("cart", cartSchema);
