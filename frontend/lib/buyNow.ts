import axiosClient from "@/lib/axios";
import { toast } from "sonner";

/**
 * Places an order for the current user.
 * @param userId - The ID of the currently logged-in user.
 */
export const buyNow = async (userId: string) => {
  try {
    const res = await axiosClient.post(`/order/placeOrder/${userId}`);
    if (res.data.success) {
      toast.success("✅ Order placed successfully!");
    } else {
      toast.error(res.data.message || "❌ Failed to place order.");
    }
  } catch (err: any) {
    if (err?.response?.status === 401) {
      toast.error("⚠️ You must be logged in to place an order.");
    } else {
      toast.error("🚫 Something went wrong while placing the order.");
    }
    console.error("Order error:", err);
  }
};
