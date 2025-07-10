"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const productData = [
  {
    category: "Electronics",
    items: [
      {
        id: 1,
        title: "Smartphone",
        price: "₹15,000",
        image: "/products/phone.png",
      },
      {
        id: 2,
        title: "Smart Watch",
        price: "₹3,999",
        image: "/products/watch.png",
      },
    ],
  },
  {
    category: "Home Essentials",
    items: [
      {
        id: 3,
        title: "Detergent Powder",
        price: "₹299",
        image: "/products/detergent.png",
      },
      { id: 4, title: "LED Bulb", price: "₹199", image: "/products/bulb.png" },
    ],
  },
  {
    category: "Grocery",
    items: [
      {
        id: 5,
        title: "Apples (1kg)",
        price: "₹120",
        image: "/products/apples.png",
      },
      {
        id: 6,
        title: "Rice (5kg)",
        price: "₹350",
        image: "/products/rice.png",
      },
    ],
  },
];

const allProducts = productData.flatMap((group) =>
  group.items.map((item) => ({ ...item, category: group.category }))
);

export default function AllProductsPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
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
  }, []);

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
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-400 transform hover:-translate-y-1 hover:scale-[1.02] p-4 flex flex-col group"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.title}
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
                {product.title}
              </h3>
              <p className="text-center text-green-600 font-bold text-lg mt-1">
                {product.price}
              </p>

              <Button
                variant="default"
                className="mt-auto w-full transition-transform duration-300 hover:scale-105 hover:shadow-md"
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
