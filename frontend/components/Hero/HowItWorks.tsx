'use client';

import { useEffect, useRef } from 'react';
import { Mic, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge'; // shadcn component

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: <Mic className="w-6 h-6 text-blue-600" />,
    title: 'Speak Your Order',
    description: 'Use your voice to search or order products directly.',
    color: 'blue',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    title: 'Confirm & Checkout',
    description: 'Quickly review and confirm your cart hands-free.',
    color: 'green',
  },
  {
    icon: <Truck className="w-6 h-6 text-orange-600" />,
    title: 'Fast Delivery',
    description: 'We deliver to your doorstep in hours, not days.',
    color: 'orange',
  },
];

export default function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const elements = stepsRef.current;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elements[0]?.parentElement,
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="h-screen relative bg-gradient-to-b from-white to-blue-50 flex items-center">
      <div className="max-w-6xl mx-auto px-6 text-center w-full">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) stepsRef.current[index] = el;
              }}
              className="flex flex-col items-center text-center opacity-0 bg-white p-8 rounded-2xl shadow-lg relative"
            >
              {/* Arrow pointing to next card (except last one) */}
              {index < steps.length - 1 && (
                <ArrowRight className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-300 hidden sm:block" />
              )}
              <div
                className={`mb-4 p-4 rounded-full shadow-md bg-${step.color}-100`}
              >
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
              <Badge className={`mt-4 bg-${step.color}-200 text-${step.color}-800`}>
                Step {index + 1}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
