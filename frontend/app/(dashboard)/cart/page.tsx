"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import CartItem from "@/components/CartItems";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import axiosClient from "@/lib/axios";
import { useUser } from "@/context/UserContext"; // get current user
import Image from "next/image";
import { toast } from "sonner";

interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // user should be loaded from context
  const [emptyCart, setEmptyCart] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const res = await axiosClient.get(`/cart/getCart/${user.id}`);
        const items = res.data.items;

        const mappedCart = items.map((item: any) => ({
          id: item.product._id,
          name: item.product.product_name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        }));

        setCart(mappedCart);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setEmptyCart(true);
        } else {
          console.error("Failed to load cart", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const removeItem = async (id: string) => {
    try {
      setCart((prev) => prev.filter((item) => item.id !== id));

      await axiosClient.delete("/cart/removeFromCart", {
        data: { productId: id },
      });

      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );

      if (quantity < 1) {
        toast.warning("Quantity must be at least 1");
        return;
      }

      await axiosClient.put(`/cart/updateCart/${id}`, {
        productId: id,
        quantity,
      });

      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error("Error updating quantity:", error);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen mt-6 px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600 mt-20">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center">
            <Image
              src="/errors/empty-cart.png" // Use your own image or illustration
              alt="Empty Cart"
              className="w-full h-full mx-auto mb-4 rounded-2xl"
              width={400}
              height={400}
            />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-4">
              Looks like you haven’t added anything yet.
            </p>
            <Link href="/products">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
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

          <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-28">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Separator className="mb-4" />

            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>

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
