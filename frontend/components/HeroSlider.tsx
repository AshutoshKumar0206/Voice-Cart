"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const images = [
  "/hero/slide1.png",
  "/hero/slide2.png",
  "/hero/slide3.png",
  "/hero/slide4.png",
  "/hero/slide5.png",
];

export default function HeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slides = container.children;
    const currentSlide = slides[currentIndex];
    const nextIndex = (currentIndex + 1) % images.length;
    const nextSlide = slides[nextIndex];

    if (!currentSlide || !nextSlide) return;

    const fadeOut = gsap.to(currentSlide, {
      autoAlpha: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    const fadeIn = gsap.fromTo(
      nextSlide,
      { autoAlpha: 0, scale: 1.05 },
      { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.out" }
    );

    const interval = setTimeout(() => {
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => {
      fadeOut.kill();
      fadeIn.kill();
      clearTimeout(interval);
    };
  }, [currentIndex]);

  return (
    <div
      className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg"
      ref={containerRef}
    >
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          className="absolute inset-0 w-full h-full object-cover opacity-0"
        />
      ))}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow">
          Big Deals. Big Savings.
        </h1>
      </div>
    </div>
  );
}
