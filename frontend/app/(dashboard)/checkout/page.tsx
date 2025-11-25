"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderSummaryCard from "@/components/shared/OrderSummaryCard";
import AddressForm from "@/components/shared/AddressForm";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import { toast } from "sonner";
import { placeOrder } from "@/lib/order";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  product_name: string;
  price: number;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export default function CheckoutPage() {
  const { user, loading: userLoading } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Address state
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      if (!user) return;
      const res = await axiosClient.get(`/cart/getCart/${user.id}`);
      setCartItems(res.data.cart.items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  const submitHandler = async () => {
    if (!fullName || !address || !phone) {
      return toast.error("Please fill all address details.");
    }

    if (!user) return toast.error("User not found");

    const success = await placeOrder(user.id, {
      fullName,
      address,
      phone,
    });

    if (success) {
      toast.success("Order placed successfully!");
      setShowAddressModal(false);
      router.push("/orders");
    }
  };

  if (loading || userLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-8 relative">

      <h1 className="text-3xl font-bold text-gray-800 my-4">🧾 Checkout</h1>

      {/* Cart Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Review Your Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <OrderSummaryCard key={index} item={item} />
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <PriceBreakdown items={cartItems} />

      <div className="text-right">
        <Button
          onClick={() => setShowAddressModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          Enter Address & Place Order
        </Button>
      </div>

      {/* ================= ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex justify-center items-center z-[500] pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[460px] border border-gray-200 pointer-events-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Delivery Details
            </h2>

            <AddressForm
              fullName={fullName}
              address={address}
              phone={phone}
              setFullName={setFullName}
              setAddress={setAddress}
              setPhone={setPhone}
            />

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                className="px-4 py-2"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </Button>

              <Button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                onClick={submitHandler}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
