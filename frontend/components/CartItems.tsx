"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { Separator } from "./ui/separator";

interface CartItemProps {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function CartItem({
  product,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  const { id, name, price, quantity, image } = product;

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      onQuantityChange(id, quantity + 1);
    } else if (type === "dec" && quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  return (
    <div className="py-6 bg-white rounded-xl shadow p-4 flex flex-col gap-6">
      <div className="flex gap-4 items-center ">
        {/* 📦 Product Image */}
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          className="rounded-lg object-cover min-w-[100px] max-h-[100px]"
        />

        {/* 📝 Name + Price */}
        <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-base">{name}</h3>
            <p className="text-sm text-muted-foreground">
              ₹{price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              aria-label="Decrement Quantity"
              disabled={quantity === 1}
              onClick={() => handleQuantityChange("dec")}
            >
              <Minus size={16} />
            </Button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              aria-label="Increment Quantity"
              onClick={() => handleQuantityChange("inc")}
            >
              <Plus size={16} />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100"
            onClick={() => onRemove(id)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
      <Separator className="my-1 w-full" />
      <div className="flex justify-end">
        <p className="text-lg text-gray-600">
          Total: ₹{(price * quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
