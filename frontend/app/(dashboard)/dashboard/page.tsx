'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { name: 'Electronics', image: '/categories/electronics.png', size: 'big' },
  { name: 'Fashion', image: '/categories/fashion.png', size: 'small' },
  { name: 'Sports', image: '/categories/sports.png', size: 'small' },
  { name: 'Home & Kitchen', image: '/categories/home.png', size: 'big' },
  { name: 'Toys', image: '/categories/toys.png', size: 'small' },
  { name: 'Books', image: '/categories/books.png', size: 'small' },
];

export default function DashboardPage() {
  const { user, loading } = useUser();
  console.log(user)
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [loading, user, router]);

  if (loading) return (
    <div>
        <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );

  return (
    <div className="px-6 py-6 space-y-12 mt-10">
      {/* 🌟 Hero Section */}
      <section className="mx-auto w-full max-w-4xl h-64 md:h-96 rounded-3xl overflow-hidden relative shadow-lg">
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
                cat.size === 'big' ? 'col-span-2 row-span-2' : ''
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
                <span className="text-white text-xl font-medium">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 💡 You could add: Trending Picks / Recommended for You */}
      {/* <section>...</section> */}
    </div>
  );
}
