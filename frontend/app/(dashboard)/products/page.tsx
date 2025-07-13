"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  product_name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/products/getAllProducts?page=${page}&limit=12`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 mt-6">
      <h1 className="text-3xl font-bold mb-8">🛍️ All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-10">
        <Button onClick={handlePrev} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-sm mt-2">Page {page} of {totalPages}</span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </section>
  );
}
