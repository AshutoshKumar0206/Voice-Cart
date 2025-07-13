"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";
import { addToCart } from "@/lib/addToCart";
import { useCart } from "@/context/CartContext";
import { buyNow } from "@/lib/buyNow";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  _id: string;
  product_name: string;
  price: number;
  image: string;
  category: string;
}

export default function AllProductsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const {refreshCart} = useCart()

  useEffect(() => {
    const fetchExploreProducts = async () => {
      try {
        const res = await axiosClient.get("/products/exploreProducts");
        if (res.data.success) {
          setProducts(res.data.exploredProducts);
        } else {
          toast.error("No products found");
        }
      } catch (error) {
        toast.error("Unable to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchExploreProducts();
  }, []);

  useEffect(() => {
    if (gridRef.current && products.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
          },
        }
      );
    }
  }, [products]);

  return (
    <section className="relative h-full w-full overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg/one.jpg"
          alt="Gradient Background"
          fill
          className="object-cover opacity-40 blur-sm"
          priority
        />
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
          🛒 Explore Our Products
        </h1>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[350px] w-full bg-gray-200 animate-pulse rounded-xl"
                />
              ))
            : products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-400 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col group"
                >
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={product.image || "/errors/missing-products.png"}
                      alt={product.product_name}
                      fill
                      className="transition-transform duration-500 group-hover:scale-110 object-contain"
                    />
                  </div>

                  <Badge
                    variant="outline"
                    className="text-xs w-fit mx-auto mb-2 px-2 py-1 border border-blue-300 text-blue-600 bg-blue-50"
                  >
                    {product.category}
                  </Badge>

                  <h3 className="text-md font-semibold text-center text-gray-800">
                    {product.product_name}
                  </h3>
                  <p className="text-center text-green-600 font-bold text-lg mt-1">
                    ₹{product.price.toLocaleString()}
                  </p>

                  <div className="flex flex-col gap-2 mt-auto w-full">
                    <Button
                      variant="default"
                      className="w-full transition-transform duration-300 hover:scale-105 hover:shadow-md"
                      onClick={() => addToCart(product._id, refreshCart)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full transition-transform duration-300 hover:scale-105 hover:shadow-md"
                      onClick={() => buyNow(product._id)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
