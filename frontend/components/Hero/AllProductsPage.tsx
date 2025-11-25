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
import { Google_Sans_Code } from "next/font/google";
import AddressForm from "../shared/AddressForm";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const googleSansFont = Google_Sans_Code({
  subsets: ["latin"],
  weight: "400",
  fallback: ["Arial", "sans-serif"],
});

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
  const { refreshCart } = useCart();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchExploreProducts = async () => {
      try {
        const res = await axiosClient.get("/products/exploreProducts");
        if (res.data.success) {
          setProducts(res.data.exploredProducts);
        } else {
          toast.error("No products found");
        }
      } catch {
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
          duration: 0.3,
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

  const submitHandler = async () => {
    if (!user) {
      toast.error("Sign up to place an order");
      router.push("/signup");
      return;
    }

    if (!fullName || !address || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res: any = await buyNow(selectedProductId!, {
        fullName,
        address,
        phone,
      });

      console.log(res);

      toast.success("Order placed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create an order");
    }

    setShowAddressModal(false);
    setFullName("");
    setAddress("");
    setPhone("");
  };

  return (
    <section
      className={`relative h-full w-full min-h-screen overflow-hidden ${googleSansFont.className}`}
    >
      {/* glowing background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),rgba(0,0,0,1))]" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800 drop-shadow">
          Explore Our Products
        </h1>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[260px] w-full bg-white/10 animate-pulse rounded-2xl backdrop-blur-xl"
                />
              ))
            : products.map((product) => (
                <div
                  key={product._id}
                  className="relative group rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image || "/errors/missing-products.png"}
                      alt={product.product_name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-95 transition-all duration-500 flex flex-col justify-end p-4">
                    <Badge
                      variant="outline"
                      className="text-[10px] w-fit mb-1 px-2 py-0.5 border border-blue-200 text-blue-100 bg-blue-500/20"
                    >
                      {product.category}
                    </Badge>

                    <p className="text-sm font-semibold text-white truncate drop-shadow">
                      {product.product_name}
                    </p>

                    <p className="text-md font-bold text-green-400 drop-shadow">
                      ₹{product.price.toLocaleString()}
                    </p>

                    {/* BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 mt-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <Button
                        className="text-[12px] bg-white text-black hover:bg-gray-800 hover:text-white shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product._id, refreshCart);
                        }}
                      >
                        Add
                      </Button>

                      <Button
                        variant="outline"
                        className="text-[12px] bg-gray-800 text-white hover:bg-white hover:text-black shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductId(product._id);
                          setShowAddressModal(true);
                        }}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-md">
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

              <Button variant="default" onClick={() => submitHandler()}>
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
