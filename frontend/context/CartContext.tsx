"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosClient from "@/lib/axios";
import { useUser } from "./UserContext";

interface CartContextType {
  cartCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useUser();

  const refreshCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axiosClient.get(`/cart/getCart/${user.id}`);
      if (res.data.success) {
        setCartCount(res.data.cart.items.length);
      }
    } catch (error) {
      console.error("Error fetching cart count", error);
    }
  }, [user]);

  useEffect(() => {
    refreshCart(); // Fetch on mount or user change
  }, [user, refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
