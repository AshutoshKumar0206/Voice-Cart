import axiosClient from "@/lib/axios";
import { toast } from "sonner";

interface AddressData {
  fullName: string;
  address: string;
  phone: string;
}

/**
 * Places an order for the current user with shipping address.
 * @param userId - The ID of the currently logged-in user.
 * @param address - Shipping address details.
 */
export const buyNow = async (userId: string, address: AddressData) => {
  try {
    const res = await axiosClient.post(`/order/placeOrder/${userId}`, { address });
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
