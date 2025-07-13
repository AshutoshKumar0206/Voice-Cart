'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Search, ShoppingCart, User, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [prevScroll, setPrevScroll] = useState(0);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { user, loading } = useUser();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (!navbarRef.current) return;

      if (currentScroll < 10) {
        gsap.to(navbarRef.current, { y: 0, opacity: 1, duration: 0.3 });
      } else if (currentScroll > prevScroll) {
        gsap.to(navbarRef.current, { y: -100, opacity: 0, duration: 0.3 });
      } else {
        gsap.to(navbarRef.current, { y: 0, opacity: 1, duration: 0.3 });
      }

      setPrevScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      ref={navbarRef}
      className={cn(
        "fixed top-0 left-0 z-50 w-full bg-white shadow transition-all duration-300"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          VoiceCart
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-2xl">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            placeholder="Search for products..."
            className="pl-10 pr-4 rounded-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <Button
                variant="ghost"
                className="relative"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 text-xs bg-red-600 text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" onClick={() => router.push("/profile")}>
                <User size={20} />
              </Button>
            </>
          ) : (
            !loading && (
              <Button
                variant="ghost"
                onClick={() => router.push("/signin")}
                className="text-blue-600 hover:text-blue-700"
              >
                <LogIn size={20} className="mr-2" />
                Sign In
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
