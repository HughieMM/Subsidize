'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function PitchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-900">
      <Navigation />

      {/* Deck Slides */}
      <div className="flex-1">
        {/* Slide 1: Title */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700 text-white">
          <div className="text-center px-4">
            <div className="text-8xl mb-8">🛒</div>
            <h1 className="text-7xl font-bold mb-6">Subsidize</h1>
            <p className="text-3xl text-white/90 mb-12">Smart Grocery Shopping for Bermuda</p>
            <p className="text-xl text-white/70">Helping families save 15-30% on groceries</p>
          </div>
        </section>

        {/* Slide 2: The Problem */}
        <section className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-5xl font-bold text-primary-900 mb-12 text-center">The Problem</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-error/10 rounded-2xl p-8">
                <div className="text-5xl mb-4">💸</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Highest Food Costs in the World</h3>
                <p className="text-lg text-text-secondary">Bermuda families spend 30-40% of income on groceries vs 10-15% in North America</p>
              </div>
              <div className="bg-warning/10 rounded-2xl p-8">
                <div className="text-5xl mb-4">😰</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-4">No Price Transparency</h3>
                <p className="text-lg text-text-secondary">Shoppers visit multiple stores or overpay without knowing better options exist</p>
              </div>
              <div className="bg-primary-50 rounded-2xl p-8">
                <div className="text-5xl mb-4">⏱️</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Time-Consuming</h3>
                <p className="text-lg text-text-secondary">Hours spent checking flyers and visiting different stores for the best deals</p>
              </div>
              <div className="bg-accent-50 rounded-2xl p-8">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-primary-900 mb-4">No Digital Solution</h3>
                <p className="text-lg text-text-secondary">No app or platform exists to compare grocery prices across Bermuda stores</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 3: The Solution */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-5xl font-bold text-primary-900 mb-12 text-center">The Solution</h2>
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-3">Compare Prices</h3>
                  <p className="text-text-secondary">Instantly see prices from 5+ stores</p>
                </div>
                <div>
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-3">Smart Baskets</h3>
                  <p className="text-text-secondary">Find cheapest store for your full shop</p>
                </div>
                <div>
                  <div className="text-6xl mb-4">🚚</div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-3">Fast Delivery</h3>
                  <p className="text-text-secondary">Local drivers deliver to your door</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 4: Market Opportunity */}
        <section className="min-h-screen flex items-center justify-center bg-primary-900 text-white">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-5xl font-bold mb-12 text-center">Market Opportunity</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-4">64K</div>
                <p className="text-xl">Bermuda Population</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-4">$500M+</div>
                <p className="text-xl">Annual Grocery Spend</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-4">100%</div>
                <p className="text-xl">Smartphone Penetration</p>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 5: Business Model */}
        <section className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-5xl font-bold text-primary-900 mb-12 text-center">Business Model</h2>
            <div className="space-y-6">
              <div className="bg-success/10 rounded-2xl p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Store Commission</h3>
                  <p className="text-text-secondary">15% on delivery orders</p>
                </div>
                <div className="text-4xl font-bold text-success">Primary</div>
              </div>
              <div className="bg-accent-50 rounded-2xl p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Delivery Fees</h3>
                  <p className="text-text-secondary">$5-7 per order</p>
                </div>
                <div className="text-3xl font-bold text-accent-600">Secondary</div>
              </div>
              <div className="bg-primary-50 rounded-2xl p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Premium Features</h3>
                  <p className="text-text-secondary">Subscription for advanced tools</p>
                </div>
                <div className="text-3xl font-bold text-primary-600">Future</div>
              </div>
            </div>
          </div>
        </section>

        {/* Slide 6: Call to Action */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 text-white">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to Transform Bermuda's Grocery Market?</h2>
            <p className="text-2xl mb-12 text-white/90">Join us in making food more affordable for every Bermudian family</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/demo" className="px-12 py-5 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all text-xl shadow-lg">
                Try Demo
              </Link>
              <a href="mailto:hello@subsidize.bm" className="px-12 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-xl border-2 border-white/30">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
