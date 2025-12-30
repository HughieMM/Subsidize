'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Partner With Subsidize</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join us in making grocery shopping more affordable and accessible for all Bermudians
          </p>
        </div>
      </section>

      {/* For Stores */}
      <section id="stores" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-900 mb-6">For Grocery Stores</h2>
              <p className="text-xl text-text-secondary mb-8">
                Reach more customers and increase sales by joining Bermuda's first comprehensive price comparison platform.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Reach New Customers</h3>
                    <p className="text-text-secondary">
                      Get discovered by price-conscious shoppers actively looking for the best deals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
                    <p className="text-text-secondary">
                      Understand your competitive position and optimize pricing strategies with real-time market data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
                    <p className="text-text-secondary">
                      Simple API integration or we can scrape your public prices. Choose what works for you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Commission-Based Model</h3>
                    <p className="text-text-secondary">
                      Only pay when we deliver sales. 15% commission on completed delivery orders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a href="mailto:stores@subsidize.bm" className="inline-block px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg">
                  Contact Us
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-12">
              <div className="aspect-square bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Current Partners</h3>
                </div>
                <div className="space-y-3 text-center">
                  <div className="text-lg font-semibold text-text-primary">MarketPlace</div>
                  <div className="text-lg font-semibold text-text-primary">Lindo's Family Foods</div>
                  <div className="text-lg font-semibold text-text-primary">Miles Market</div>
                  <div className="text-lg font-semibold text-text-primary">Supermart</div>
                  <div className="text-lg font-semibold text-text-primary">DropIt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Drivers */}
      <section id="drivers" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-accent-500 to-primary-500 rounded-3xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-6">Driver Earnings Example</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span>10 deliveries/day</span>
                    <span className="text-xl font-bold">$150</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/20">
                    <span>5 days/week</span>
                    <span className="text-xl font-bold">$750/week</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg">Monthly Potential</span>
                    <span className="text-3xl font-bold">$3,000+</span>
                  </div>
                </div>
                <p className="mt-6 text-white/80 text-sm">*Based on average commission of $15/delivery</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-primary-900 mb-6">For Delivery Drivers</h2>
              <p className="text-xl text-text-secondary mb-8">
                Earn money on your own schedule delivering groceries to your neighbors.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                    <p className="text-text-secondary">Work when you want. Accept orders that fit your schedule.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Competitive Earnings</h3>
                    <p className="text-text-secondary">Earn 15% commission on every order, plus delivery fees and tips.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Simple App</h3>
                    <p className="text-text-secondary">Easy-to-use mobile app shows you available orders, navigation, and earnings.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏝️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Local Community</h3>
                    <p className="text-text-secondary">Help your community while earning. Deliver to neighbors you know.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a href="mailto:drivers@subsidize.bm" className="inline-block px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all shadow-lg">
                  Join as Driver
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Government */}
      <section id="government" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-900 mb-6">Government Subsidy Programs</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Subsidize is designed to integrate seamlessly with government food subsidy initiatives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface rounded-2xl p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Targeted Support</h3>
              <p className="text-text-secondary">
                Digital vouchers and subsidies can be applied directly through the platform, ensuring benefits reach intended recipients.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Usage Tracking</h3>
              <p className="text-text-secondary">
                Real-time reporting on subsidy usage, food access patterns, and program effectiveness.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8">
              <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Healthy Food Access</h3>
              <p className="text-text-secondary">
                Incentivize purchases of fresh produce and healthy options through targeted subsidy programs.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="mailto:government@subsidize.bm" className="inline-block px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg">
              Discuss Partnership
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
