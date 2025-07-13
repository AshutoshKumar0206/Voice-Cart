"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { name: "Electronics", image: "/categories/electronics.png", size: "big" },
  { name: "Fashion", image: "/categories/fashion.png", size: "small" },
  { name: "Sports", image: "/categories/sports.png", size: "small" },
  { name: "Home & Kitchen", image: "/categories/home.png", size: "big" },
  { name: "Toys", image: "/categories/toys.png", size: "small" },
  { name: "Books", image: "/categories/books.png", size: "small" },
];

interface Product {
  _id: string;
  product_name: string;
  price: number;
  image?: string;
  category?: string;
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/exploreProducts`
        );
        const data = await res.json();
        console.log(data)
        if (data.success) {
          setExploreProducts(data.exploredProducts);
        }
      } catch (err) {
        console.error("Failed to fetch explore products:", err);
      } finally {
        setProductLoading(false);
      }
    };

    fetchExplore();
  }, []);

  if (loading)
    return (
      <div>
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );

  return (
    <div className="px-6 py-6 space-y-12 mt-10">
      {/* 🌟 Hero Section */}
      <section className="mx-auto w-full max-w-4xl h-64 md:h-96 rounded-3xl overflow-hidden relative shadow-lg hover:scale-103 transition-transform duration-300 hover:border-s3 hover:shadow-2xl">
        <HeroSlider />
      </section>

      {/* 🗂️ Categories Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Shop by Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/category/${cat.name.toLowerCase()}`}
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

      {/* 🌟 Recommended Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">🧠 Recommended for You</h2>

        {productLoading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl col-span-1" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 auto-rows-[200px] gap-5">
            {/* Electronics Category: Large left block */}
            <div className="col-span-2 row-span-2 bg-white rounded-2xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] p-4 flex flex-col justify-between">
              <p className="text-sm text-blue-600 font-semibold mb-2">
                Electronics
              </p>
              {exploreProducts
                .filter((p) => p.category === "Electronics")
                .slice(0, 2)
                .map((product, i) => (
                  <div
                    key={product._id}
                    className="flex gap-3 mb-2 group-hover:scale-105 transition-transform duration-500"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={product.image || "/errors/missing-products.png"}
                        alt={product.product_name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        {product.product_name}
                      </p>
                      <p className="text-green-600 font-bold text-sm mt-1">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Grocery Category: Small card top-right */}
            {exploreProducts
              .filter((p) => p.category === "Grocery")
              .slice(0, 1)
              .map((product) => (
                <div
                  key={product._id}
                  className="col-span-1 row-span-1 bg-white rounded-2xl shadow group hover:shadow-lg p-3 transition-transform duration-300 hover:scale-[1.03]"
                >
                  <p className="text-sm text-yellow-600 font-semibold mb-2">
                    Grocery
                  </p>
                  <div className="relative w-full h-28 rounded overflow-hidden mb-2">
                    <Image
                      src={product.image || "/errors/missing-products.png"}
                      alt={product.product_name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-gray-700 text-sm truncate">
                    {product.product_name}
                  </p>
                  <p className="text-green-600 font-semibold text-sm">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              ))}

            {/* Fashion Category: Two medium items */}
            {exploreProducts
              .filter((p) => p.category === "Fashion")
              .slice(0, 2)
              .map((product) => (
                <div
                  key={product._id}
                  className="col-span-1 row-span-1 bg-white rounded-2xl shadow group hover:shadow-lg p-3 transition-transform duration-300 hover:scale-[1.03]"
                >
                  <p className="text-sm text-pink-500 font-semibold mb-2">
                    Fashion
                  </p>
                  <div className="relative w-full h-28 rounded overflow-hidden mb-2">
                    <Image
                      src={product.image || "/errors/missing-products.png"}
                      alt={product.product_name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-gray-700 text-sm truncate">
                    {product.product_name}
                  </p>
                  <p className="text-green-600 font-semibold text-sm">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              ))}

            {/* Other categories filler blocks */}
            {exploreProducts
              .filter(
                (p) =>
                  !["Electronics", "Grocery", "Fashion"].includes(p.category!)
              )
              .slice(0, 3)
              .map((product) => (
                <div
                  key={product._id}
                  className="col-span-1 row-span-1 bg-white rounded-2xl shadow group hover:shadow-lg p-3 transition-transform duration-300 hover:scale-[1.03]"
                >
                  <p className="text-sm text-gray-500 font-semibold mb-2">
                    {product.category}
                  </p>
                  <div className="relative w-full h-28 rounded overflow-hidden mb-2">
                    <Image
                      src={product.image || "/errors/missing-products.png"}
                      alt={product.product_name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-gray-700 text-sm truncate">
                    {product.product_name}
                  </p>
                  <p className="text-green-600 font-semibold text-sm">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
