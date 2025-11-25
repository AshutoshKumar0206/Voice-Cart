"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import ProductCard from "@/components/shared/ProductCard";
import {Google_Sans_Code} from "next/font/google"

const googleSansFont = Google_Sans_Code({
  subsets: ["latin"],
  weight: "400",
  fallback: ["Arial", "sans-serif"],
})

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query && !category) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        let res;
        if (category) {
          // Fetch by category
          res = await axiosClient.get(`/products/getProductsByCategory/${category}`);
        } else {
          // Fetch by search query
          res = await axiosClient.post("/voice/getProductByName", {
            command: query,
          });
        }

        if (res.data.success) {
          setProducts(res.data.products || []);
        } else {
          setProducts([]);
          setError(res.data.message || "No products found.");
        }
      } catch (err) {
        console.error("Search failed:", err);
        setProducts([]);
        setError("Unable to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category]);

  return (
    <div className={`px-6 pt-24 pb-12 ${googleSansFont.className}`}>
      <h1 className="text-2xl font-bold mb-6">
        {category
          ? `Products in "${category}"`
          : `Results for "${query}"`}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 max-w-5xl gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
