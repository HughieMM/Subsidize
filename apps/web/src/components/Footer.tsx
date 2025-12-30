import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <span className="text-xl font-bold">Subsidize</span>
            </div>
            <p className="text-white/70 text-sm">
              Smart grocery shopping for Bermuda. Compare prices, save money, get delivered.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/demo" className="text-white/70 hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-white/70 hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Partners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/partners#stores" className="text-white/70 hover:text-white transition-colors">
                  For Stores
                </Link>
              </li>
              <li>
                <Link href="/partners#drivers" className="text-white/70 hover:text-white transition-colors">
                  For Drivers
                </Link>
              </li>
              <li>
                <Link href="/partners#government" className="text-white/70 hover:text-white transition-colors">
                  Government Programs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pitch" className="text-white/70 hover:text-white transition-colors">
                  Pitch Deck
                </Link>
              </li>
              <li>
                <a href="mailto:hello@subsidize.bm" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/50">
          <p>© 2024 Subsidize. Made in Bermuda 🇧🇲</p>
        </div>
      </div>
    </footer>
  );
}
