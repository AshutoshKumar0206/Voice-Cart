"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import CartItem from "@/components/CartItems"; // You’ll create this
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // Mock fetch or load from context/localStorage
  useEffect(() => {
    setCart([
      {
        id: "1",
        name: "Wireless Headphones",
        price: 2999,
        quantity: 2,
        image: "/products/headphones.png",
      },
      {
        id: "2",
        name: "Smart Watch",
        price: 3999,
        quantity: 1,
        image: "/products/watch.png",
      },
    ]);
  }, []);

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen mt-6 px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 mt-20">
          <ShoppingCart size={64} />
          <p className="mt-4 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                product={item}
                onRemove={removeItem}
                onQuantityChange={updateQuantity}
              />
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-28">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Separator className="mb-4" />

            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>

            {/* Future fields like Shipping, Discount, Tax can go here */}

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-semibold mb-6">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md py-2 rounded-lg">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
