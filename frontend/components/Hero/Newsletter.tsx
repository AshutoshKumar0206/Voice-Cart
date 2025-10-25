'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Collect all animated elements (div, h2, p, form, etc.)
  const elementsRef = useRef<HTMLElement[]>([]);
  elementsRef.current = []; // reset before each render

  // Push elements safely into the ref array
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(elementsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.5,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 py-20 overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 -z-10 opacity-30 blur-3xl">
        <div className="absolute top-10 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply animate-pulse delay-1000"></div>
      </div>

      <div
        ref={addToRefs}
        className="max-w-3xl mx-auto text-center bg-white shadow-lg rounded-2xl p-10 border border-blue-100"
      >
        <h2
          ref={addToRefs}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Stay Updated
        </h2>

        <p ref={addToRefs} className="text-gray-600 mb-8 text-lg">
          Join our newsletter and get the latest updates, voice shopping tips,
          and exclusive offers — straight to your inbox.
        </p>

        <form
          ref={addToRefs}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full sm:w-2/3 px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#460273] text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>

        <p ref={addToRefs} className="text-sm text-gray-500 mt-5">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
