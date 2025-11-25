"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/lib/addToCart";
import { buyNow } from "@/lib/buyNow";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Google_Sans_Code } from "next/font/google";

const googleSansFont = Google_Sans_Code({
  subsets: ["latin"],
  weight: "400",
  fallback: ["Arial", "sans-serif"],
});

interface Product {
  _id: string;
  product_name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    fullName: "",
    address: "",
    phone: "",
  });
  const { refreshCart } = useCart();

  const handleBuyNow = () => {
    setAddressOpen(true);
  };

  const handleConfirmPurchase = () => {
    buyNow(product._id, addressData); // Pass address data to your buyNow function
    setAddressOpen(false);
    setOpen(false); // close product modal
  };

  return (
    <>
      {/* Product Card with Recommended Overlay Style */}
      <div
        className={`relative rounded-2xl shadow group overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.03] min-h-[200px] ${googleSansFont.className}`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={product.image || "/errors/missing-products.png"}
          alt={product.product_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
          <p className="text-sm font-medium text-white truncate">
            {product.product_name}
          </p>
          <p className="text-sm font-bold text-green-400 mt-1">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Side */}
            <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-white">
              <Image
                src={product.image || "/errors/missing-products.png"}
                alt={product.product_name}
                fill
                className="object-contain p-10"
              />
            </div>

            {/* Info Side */}
            <div className="p-8 md:p-10 space-y-6">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-gray-800">
                  {product.product_name}
                </DialogTitle>
                <p className="text-sm text-gray-500">{product.category}</p>
              </DialogHeader>

              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>

              <p className="text-2xl font-semibold text-blue-600">
                ₹{product.price.toLocaleString()}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => addToCart(product._id, refreshCart)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-1/2 font-medium"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Address Form Modal */}
      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Shipping Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
              <Input
                placeholder="Full Name"
                value={addressData.fullName}
                onChange={(e) =>
                  setAddressData({ ...addressData, fullName: e.target.value })
                }
                className="bg-transparent focus:bg-white"
              />
            </div>

            <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
              <Textarea
                placeholder="Full Address with Pin Code"
                value={addressData.address}
                onChange={(e) =>
                  setAddressData({ ...addressData, address: e.target.value })
                }
                className="bg-transparent focus:bg-white"
              />
            </div>

            <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
              <Input
                placeholder="Phone Number"
                type="tel"
                value={addressData.phone}
                onChange={(e) =>
                  setAddressData({ ...addressData, phone: e.target.value })
                }
                className="bg-transparent focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setAddressOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPurchase}>Confirm Purchase</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
