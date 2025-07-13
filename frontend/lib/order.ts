import axiosClient from "@/lib/axios";
import { toast } from "sonner";

/**
 * Place order for the current user's cart.
 * @param userId - ID of the user placing the order
 */
export const placeOrder = async (userId: string): Promise<boolean> => {
  try {
    console.log("Placing order for user:", userId);
    const res = await axiosClient.post(`/order/placeOrder/${userId}`);
    if (res.data.success) {
      toast.success("🎉 Order placed successfully!");
      return true;
    } else {
      toast.error(res.data.message || "Failed to place order");
      return false;
    }
  } catch (error) {
    toast.error("Error placing order");
    console.error("Order error:", error);
    return false;
  }
};
