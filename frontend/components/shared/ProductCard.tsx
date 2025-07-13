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
import { Card } from "@/components/ui/card";
import { addToCart } from "@/lib/addToCart";
import { useCart } from "@/context/CartContext";
import { buyNow } from "@/lib/buyNow";

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
  const {refreshCart} = useCart();

  return (
    <>
      {/* Product Thumbnail Card */}
      <Card
        className="group transition-transform hover:scale-[1.05] duration-300 cursor-pointer overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-lg rounded-2xl"
        onClick={() => setOpen(true)}
      >
        <div className="relative w-full h-44 bg-gray-50">
          <Image
            src={product.image || `/errors/missing-products.png`}
            alt={product.product_name}
            fill
            className="object-contain px-3 py-2 transition-transform group-hover:scale-105 rounded-t-2xl"
          />
        </div>
        <div className="p-4 space-y-1">
          <h3 className="text-sm font-semibold truncate">
            {product.product_name}
          </h3>
          <p className="text-xs text-gray-500">{product.category}</p>
          <p className="text-blue-600 font-bold text-sm mt-1">
            ₹{product.price}
          </p>
        </div>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl shadow-xl border border-gray-200"
        >
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
                  onClick={() => buyNow(product._id)}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
