import axiosClient from "@/lib/axios";
import { toast } from "sonner";

/**
 * Place order for the current user's cart.
 * @param userId - ID of the user placing the order
 * @param addressData - contains fullName, address, phone
 */
export const placeOrder = async (
  userId: string,
  addressData: {
    fullName: string;
    address: string;
    phone: string;
  }
): Promise<boolean> => {
  try {
    console.log("Placing order for user:", userId);
    console.log("Address data:", addressData);

    const res = await axiosClient.post(
      `/order/placeOrder`,
      addressData
    );

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
