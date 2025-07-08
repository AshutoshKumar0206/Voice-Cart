'use client';

import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">VoiceCart</h3>
          <p className="text-sm text-gray-400">
            Your voice-powered shopping assistant for groceries, gadgets, and more.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-md font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white">How It Works</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-md font-semibold text-white mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white">Help Center</Link></li>
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-md font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} VoiceCart. All rights reserved.
      </div>
    </footer>
  );
}
