"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from("#hero-image", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.out",
    })
      .from(
        "#hero-text",
        {
          opacity: 0,
          x: 40,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4" // slight overlap with previous
      )
      .from(
        "#hero-buttons",
        {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4" // overlap more to keep it tight
      );
  }, []);

  return (
    <section className="relative w-full overflow-hidden h-screen">
      {/* IMAGE BACKGROUND */}
      <div id="hero-image" className="absolute inset-0 -z-10 transition-all">
        <Image
          src="/home/hero.png"
          alt="Person giving voice command"
          fill
          className="object-contain mt-24 md:mt-0"
          priority
        />
      </div>

      {/* OVERLAY TEXT CONTENT */}
      <div className="h-full w-full flex flex-col justify-between px-6 md:px-12 py-15 text-gray-900">
        <div
          id="hero-text"
          className="text-center md:text-left max-w-3xl mt-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-sm">
            Shop Smarter <br /> <p className="mt-2">with Your Voice</p>
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium text-gray-700">
            Order groceries, electronics, and more — just by speaking.
          </p>
        </div>

        {/* BUTTONS BOTTOM RIGHT */}
        <div id="hero-buttons" className="self-end flex gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg shadow-md"
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/signin">
            <Button
              size="lg"
              variant="outline"
              className="bg-white border border-blue-600 text-blue-700 px-6 py-3 text-lg rounded-lg shadow-md hover:bg-blue-50"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
