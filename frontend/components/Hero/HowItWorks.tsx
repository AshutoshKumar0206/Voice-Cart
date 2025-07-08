'use client';

import { Mic, CheckCircle, Truck } from 'lucide-react';

const steps = [
  {
    icon: <Mic className="w-6 h-6 text-blue-600" />,
    title: 'Speak Your Order',
    description: 'Use your voice to search or order products directly.',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    title: 'Confirm & Checkout',
    description: 'Quickly review and confirm your cart hands-free.',
  },
  {
    icon: <Truck className="w-6 h-6 text-orange-600" />,
    title: 'Fast Delivery',
    description: 'We deliver to your doorstep in hours, not days.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-900">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gray-100 rounded-full">{step.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
