"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";
import { add } from "date-fns";
import { addToCart } from "@/lib/addToCart";
import { useCart } from "@/context/CartContext";
import { buyNow } from "@/lib/buyNow";

interface Deal {
  _id: string;
  product_name: string;
  price: number;
  image: string;
}

export default function TopDealsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [topDeals, setTopDeals] = useState<Deal[]>([]);
  const CARD_WIDTH = 336;
  const {refreshCart} = useCart();
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axiosClient.get("/products/getTopDeals");
        if (res.data.success) {
          // Repeat deals to enable seamless looping
          setTopDeals([
            ...res.data.topDeals,
            ...res.data.topDeals,
            ...res.data.topDeals,
          ]);
        } else {
          toast.error("No top deals found");
        }
      } catch (err) {
        toast.error("Failed to load top deals");
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || topDeals.length === 0) return;

    const totalCardCount = topDeals.length;
    const fullWidth = CARD_WIDTH * totalCardCount;

    // Move to the "middle" clone set
    gsap.set(container, { x: -1 * CARD_WIDTH * (totalCardCount / 3) });

    const tween = gsap.to(container, {
      x: `-=${CARD_WIDTH * (totalCardCount / 3)}`,
      duration: 20,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const wrapped = parseFloat(x) % fullWidth;
          return wrapped;
        }),
      },
    });

    tweenRef.current = tween;

    return () => {
      tween.kill();
    };
  }, [topDeals.length]);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.play();

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    pause();

    const offset = direction === "left" ? CARD_WIDTH : -CARD_WIDTH;
    gsap.to(containerRef.current, {
      x: `+=${offset}`,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        resume();
      },
    });
  };

  return (
    <section className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg/two.jpg"
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
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-2 shadow hover:bg-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-2 shadow hover:bg-white"
          >
            <ChevronRight size={24} />
          </button>

          {/* Deals Row */}
          <div
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="overflow-hidden"
          >
            <div ref={containerRef} className="flex gap-6 w-fit">
              {topDeals.map((deal, index) => (
                <div
                  key={`${deal._id}-${index}`}
                  className="min-w-[320px] max-h-[500px] bg-white border rounded-xl shadow hover:shadow-xl transition-all p-4 flex flex-col items-center justify-between"
                >
                  <Image
                    src={deal.image || "/errors/missing-products.png"}
                    alt={deal.product_name}
                    width={200}
                    height={200}
                    className="object-cover object-center w-full h-[200px] rounded-lg"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-center">
                    {deal.product_name}
                  </h3>
                  <p className="text-center text-blue-600 font-bold text-lg">
                    ₹{deal.price.toLocaleString()}
                  </p>

                  <div className="flex flex-col gap-2 w-full mt-3">
                    <Button
                      className="w-full bg-blue-600 text-white"
                      onClick={() => addToCart(deal._id, refreshCart)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => buyNow(deal._id)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center text-gray-800 mt-4">
          Much More Exciting Things Awaits You...
        </h2>
      </div>
    </section>
  );
}
