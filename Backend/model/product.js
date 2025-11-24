import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    image: {
      type: String,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    discount: {
      type: Number,
      min: 5,
      max: 20,
    },
    brand: { type: String },
    inStock: { type: Boolean, default: true },
    subCategory: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    tags: [{ type: String }],
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("product", productSchema);
