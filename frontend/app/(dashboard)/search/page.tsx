// /app/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import ProductCard from "@/components/shared/ProductCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axiosClient
      .post("/voice/getProductByName", {
        command: query,
      })
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.error("Search failed:", err);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="px-6 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-6">
        Results for &quot;{query}&quot;
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
