import axiosClient from "@/lib/axios";
import { toast } from "sonner";

export const addToCart = async (productId: string, refreshCart: () => void) => {
  try {
    console.log("Adding to cart:", productId);
    const response = await axiosClient.post(`/cart/addToCart/${productId}`);
    if (response.data.success) {
      toast.success("🛒 Product added to cart!");
      refreshCart(); // 🔁 refresh count in navbar
    } else {
      toast.error(response.data.message || "Failed to add product to cart.");
    }
  } catch (err: any) {
    if (err?.response?.status === 401) {
      toast.error("You must be logged in to add to cart.");
    } else {
      toast.error("Something went wrong while adding to cart.");
    }
    console.error("Add to cart error:", err);
  }
};
