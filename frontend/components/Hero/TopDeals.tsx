"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";
import { addToCart } from "@/lib/addToCart";
import { useCart } from "@/context/CartContext";
import { buyNow } from "@/lib/buyNow";
import { Google_Sans_Code } from "next/font/google";
import AddressForm from "../shared/AddressForm";

const googleSansFont = Google_Sans_Code({
  subsets: ["latin"],
  weight: "400",
  fallback: ["Arial", "sans-serif"],
});

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
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axiosClient.get("/products/getTopDeals");
        console.log(res.data)
        if (res.data.success) {
          setTopDeals([
            ...res.data.topProducts,
            ...res.data.topProducts,
            ...res.data.topProducts,
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
        resume()
      }
    });
  };

  // ==========================
  // Address Modal Integration
  // ==========================
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <section className={`relative h-full w-full overflow-hidden bg-transparent ${googleSansFont.className}`}>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(transparent_97%,rgba(0,0,0,0.03)_98%),linear-gradient(90deg,transparent_97%,rgba(0,0,0,0.03)_98%)] bg-[length:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 py-16 h-full flex flex-col justify-center gap-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Top Deals
        </h2>

        <div className="relative">
          <div
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="overflow-hidden rounded-2xl p-2 bg-transparent shadow-none"
          >
            <div ref={containerRef} className="flex gap-6 w-fit">
              {topDeals.map((deal, index) => (
                <div
                  key={`${deal._id}-${index}`}
                  className="min-w-[320px] max-h-[500px] bg-white border rounded-xl shadow hover:shadow-xl hover:scale-102 transition-all p-4 flex flex-col items-center justify-between"
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
                      onClick={() => {
                        setSelectedProductId(deal._id);
                        setShowAddressModal(true);
                      }}
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

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[420px] shadow-xl">

            <AddressForm
              fullName={fullName}
              address={address}
              phone={phone}
              setFullName={setFullName}
              setAddress={setAddress}
              setPhone={setPhone}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </Button>

              <Button
                variant="default"
                onClick={async () => {
                  if (!fullName || !address || !phone) {
                    toast.error("Please fill all fields");
                    return;
                  }

                  await buyNow(selectedProductId!, {
                    fullName,
                    address,
                    phone,
                  });

                  toast.success("Order placed!");
                  setShowAddressModal(false);
                  setFullName("");
                  setAddress("");
                  setPhone("");
                }}
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
