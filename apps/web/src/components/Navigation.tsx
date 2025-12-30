import Link from 'next/link';
import React from 'react';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-primary-900">Subsidize</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/demo"
              className="text-text-secondary hover:text-primary-600 font-medium transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/partners"
              className="text-text-secondary hover:text-primary-600 font-medium transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/pitch"
              className="text-text-secondary hover:text-primary-600 font-medium transition-colors"
            >
              Pitch
            </Link>
            <Link
              href="/demo"
              className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
