"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const topDeals = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: "₹2999",
    image: "/products/headphones.png",
  },
  {
    id: 2,
    title: "Smart Watch",
    price: "₹4999",
    image: "/products/apples.png",
  },
  {
    id: 3,
    title: "Bluetooth Speaker",
    price: "₹1499",
    image: "/products/phone.png",
  },
  {
    id: 4,
    title: "Gaming Mouse",
    price: "₹999",
    image: "/products/detergent.png",
  },
];

export default function TopDealsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const CARD_WIDTH = 336; // includes margin/gap
  const REPEAT_DEALS = [...topDeals, ...topDeals]; // for seamless loop

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tween = gsap.to(container, {
      x: `-=${CARD_WIDTH * topDeals.length}`,
      duration: 20,
      ease: "linear",
      repeat: -1,
    });

    tweenRef.current = tween;

    return () => {
      tween.kill(); // ✅ kill the animation on unmount
    };
  }, []);

  const pause = () => tweenRef.current?.pause();
  const resume = (): void => {
    tweenRef.current?.play();
  };

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    pause(); // Pause GSAP so manual scroll feels responsive
    gsap.to(containerRef.current, {
      x: `+=${direction === "left" ? CARD_WIDTH : -CARD_WIDTH}`,
      duration: 0.6,
      ease: "power2.out",
      onComplete: resume, // Resume auto-scroll after scroll
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 🔆 Background image overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg/two.jpg" // ✅ Replace with your background image
          alt="Deals Background"
          fill
          className="object-cover opacity-40 blur-sm"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 h-full flex flex-col justify-center gap-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          🔥 Top Deals
        </h2>

        <div className="relative">
          {/* ⬅️ Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-50] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-2 shadow hover:bg-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-50] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-2 shadow hover:bg-white"
          >
            <ChevronRight size={24} />
          </button>

          {/* 🔁 Auto-scrollable row */}
          <div
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="overflow-hidden"
          >
            <div ref={containerRef} className="flex gap-6 w-fit">
              {REPEAT_DEALS.map((deal, index) => (
                <div
                  key={`${deal.id}-${index}`}
                  className="min-w-[320px] bg-white border rounded-xl shadow hover:shadow-xl transition-all p-4 flex flex-col items-center justify-between"
                >
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    width={220}
                    height={220}
                    className="object-contain"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-center">
                    {deal.title}
                  </h3>
                  <p className="text-center text-blue-600 font-bold text-lg">
                    {deal.price}
                  </p>
                  <Button className="mt-3 w-full">Buy Now</Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center text-gray-800 mt-4">
            Much More Exciting Things Awaits You..
        </h2>
      </div>
    </section>
  );
}
