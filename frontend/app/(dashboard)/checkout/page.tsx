"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderSummaryCard from "@/components/shared/OrderSummaryCard";
import AddressForm from "@/components/shared/AddressForm";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import { useCallback } from "react";
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
  const fetchCart = useCallback(async () => {
    try {
      if (!user) return;
      const res = await axiosClient.get(`/cart/getCart/${user.id}`);
      console.log(res.data);
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

  if (loading || userLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) return toast.error("User not found");
    const success = await placeOrder(user.id);
    if (success) {
      router.push("/orders"); // or a success page
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 my-4">🧾 Checkout</h1>

      {/* Cart Items Summary */}
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

      {/* Address Form */}
      <AddressForm />

      {/* Price Breakdown & Final Button */}
      <PriceBreakdown items={cartItems} />
      <div className="text-right">
        <Button onClick={handlePlaceOrder} className="w-full sm:w-auto">
          Place Order
        </Button>
      </div>
    </section>
  );
}
