"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/addToCart";
import { useCart } from "@/context/CartContext";
import { buyNow } from "@/lib/buyNow";
import { Google_Sans_Code } from "next/font/google";
import { toast } from "sonner";
import AddressForm from "@/components/shared/AddressForm";
import axiosClient from "@/lib/axios"

const googleSansFont = Google_Sans_Code({
  subsets: ["latin"],
  weight: "400",
  fallback: ["Arial", "sans-serif"],
});

const categories = [
  { name: "Electronics", image: "/categories/electronics.png", size: "big" },
  { name: "Fashion", image: "/categories/fashion.png", size: "small" },
  { name: "Sports", image: "/categories/sports.png", size: "small" },
  { name: "Home & Kitchen", image: "/categories/home.png", size: "big" },
  { name: "Toys", image: "/categories/toys.png", size: "small" },
  { name: "Books", image: "/categories/books.png", size: "small" },
];

const recommendedLayout = [
  { category: "Electronics", colSpan: 2, rowSpan: 2 },
  { category: "Books", colSpan: 1, rowSpan: 1 },
  { category: "Toys", colSpan: 1, rowSpan: 1 },
  { category: "Electronics", colSpan: 2, rowSpan: 2 },
  { category: "Home & Kitchen", colSpan: 2, rowSpan: 2 },
  { category: "Clothing", colSpan: 1, rowSpan: 1 },
  { category: "Grocery", colSpan: 1, rowSpan: 1 },
  { category: "Toys", colSpan: 1, rowSpan: 1 },
];

interface Product {
  _id: string;
  product_name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
}

export default function DashboardPage() {
  const { loading, user } = useUser();
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { refreshCart } = useCart();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res: any = await axiosClient.get(
          `/user/recommendProducts`
        );
        console.log(res.data)
        const data = res.data;
        if (data.success) setExploreProducts(data.recommendedProducts);
      } catch (err) {
        console.error("Failed to fetch explore products:", err);
      } finally {
        setProductLoading(false);
      }
    };
    fetchExplore();
  }, []);

  if (loading) return <Skeleton className="h-20 w-full rounded-xl" />;

  const usedProducts: Record<string, number> = {};

  const submitHandler = async () => {
    if (!selectedProductId) {
      toast.error("Missing product");
      return;
    }

    if (!fullName || !address || !phone) {
      toast.error("Please fill all details");
      return;
    }

    try {
      await buyNow(selectedProductId, {
        fullName,
        address,
        phone,
      });

      // toast.success("Order placed successfully");
    } catch (err) {
      // toast.error("Failed to place order");
      console.error(err)
    }

    setShowAddressModal(false);
    setFullName("");
    setAddress("");
    setPhone("");
    setSelectedProductId(null);
  };

  return (
    <div className={`px-6 py-6 space-y-12 mt-10 ${googleSansFont.className}`}>
      <section className="mx-auto w-full max-w-4xl h-64 md:h-96 rounded-3xl overflow-hidden relative shadow-lg hover:scale-103 transition-transform duration-300 hover:border-s3 hover:shadow-2xl">
        <HeroSlider />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/search?category=${cat.name.toLowerCase()}`}
              className={`relative rounded-xl overflow-hidden shadow group ${
                cat.size === "big" ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xl font-medium">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">🧠 Recommended for You</h2>

        {productLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl col-span-1" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5 auto-rows-[200px]">
            {recommendedLayout.map((slot, idx) => {
              const categoryProducts = exploreProducts.filter(
                (p) => p.category === slot.category
              );
              if (!categoryProducts.length) return null;

              const usedIndex = usedProducts[slot.category] || 0;
              const product =
                categoryProducts[usedIndex % categoryProducts.length];
              usedProducts[slot.category] = usedIndex + 1;

              const colSpanClass =
                slot.colSpan === 2 ? "col-span-2" : "col-span-1";
              const rowSpanClass =
                slot.rowSpan === 2 ? "row-span-2" : "row-span-1";

              return (
                <div
                  key={idx}
                  className={`relative ${colSpanClass} ${rowSpanClass} rounded-2xl shadow group overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.03] min-h-[200px]`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <Image
                    src={product.image || "/errors/missing-products.png"}
                    alt={product.product_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                    <p className="text-xs font-semibold text-white mb-1 truncate">
                      {product.category}
                    </p>
                    <p className="text-sm font-medium text-white truncate">
                      {product.product_name}
                    </p>
                    <p className="text-sm font-bold text-green-400 mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="pointer-events-none w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 pointer-events-auto">
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-white">
                <Image
                  src={selectedProduct.image || "/errors/missing-products.png"}
                  alt={selectedProduct.product_name}
                  fill
                  className="object-contain p-10"
                />
              </div>

              <div className="p-8 md:p-10 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-gray-800">
                    {selectedProduct.product_name}
                  </DialogTitle>
                  <p className="text-sm text-gray-500">
                    {selectedProduct.category}
                  </p>
                </DialogHeader>

                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {selectedProduct.description}
                </p>

                <p className="text-2xl font-semibold text-blue-600">
                  ₹{selectedProduct.price.toLocaleString()}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    onClick={() => addToCart(selectedProduct._id, refreshCart)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2 font-medium"
                    onClick={() => {
                      setSelectedProductId(selectedProduct._id);
                      setShowAddressModal(true);
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex justify-center items-center z-[500] pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[460px] border border-gray-200 pointer-events-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Delivery Details
            </h2>

            <AddressForm
              fullName={fullName}
              address={address}
              phone={phone}
              setFullName={setFullName}
              setAddress={setAddress}
              setPhone={setPhone}
            />

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                className="px-4 py-2"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </Button>

              <Button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                onClick={submitHandler}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
