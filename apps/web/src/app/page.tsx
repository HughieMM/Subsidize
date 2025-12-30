'use client';

import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-primary-900 mb-6 leading-tight">
                Smart Grocery Shopping for{' '}
                <span className="text-primary-500">Bermuda</span>
              </h1>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                Compare prices across all major stores, find the best deals, and get
                groceries delivered to your door. Save money on every shop.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/demo"
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-center"
                >
                  Try Interactive Demo
                </Link>
                <Link
                  href="/pitch"
                  className="px-8 py-4 bg-white hover:bg-primary-50 text-primary-600 font-semibold rounded-xl transition-all border-2 border-primary-200 hover:border-primary-300 text-center"
                >
                  View Pitch Deck
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-text-tertiary">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  <span>5+ Stores</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span>Save 15-30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Mock App Screenshot */}
            <div className="relative">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 text-white">
                  <div className="h-12 bg-white/10 rounded-xl mb-6 flex items-center px-4">
                    <div className="w-6 h-6 bg-white/30 rounded"></div>
                    <div className="ml-3 flex-1 h-4 bg-white/20 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-white/10 rounded-xl p-4 flex gap-4"
                      >
                        <div className="w-16 h-16 bg-white/20 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-white/20 rounded w-3/4"></div>
                          <div className="h-3 bg-white/20 rounded w-1/2"></div>
                          <div className="h-4 bg-accent-500 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Three simple steps to smarter grocery shopping
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-3">
                Search & Compare
              </h3>
              <p className="text-text-secondary">
                Search for any product and instantly see prices from MarketPlace,
                Lindo's, Miles, DropIt, and Supermart.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-3">
                Build Your Basket
              </h3>
              <p className="text-text-secondary">
                Add items to your basket and see which store offers the best total
                price for your complete shop.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-3">
                Get Delivered
              </h3>
              <p className="text-text-secondary">
                Order delivery from the best-priced store and get your groceries
                delivered by local drivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Bermuda Needs Subsidize
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💸</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Combat High Food Costs
                    </h3>
                    <p className="text-white/70">
                      Bermuda has some of the highest grocery prices in the world.
                      Subsidize helps families save 15-30% on every shop.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                    <p className="text-white/70">
                      No more visiting multiple stores or checking flyers. Find the
                      best prices in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Support Local Economy
                    </h3>
                    <p className="text-white/70">
                      Connects local stores with customers and creates delivery jobs
                      for Bermudian drivers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Subsidy Program Ready
                    </h3>
                    <p className="text-white/70">
                      Built to integrate with government subsidy programs, making
                      healthy food more accessible.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-white/5 rounded-3xl p-8">
                <div className="h-full bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-5xl font-bold mb-2">15-30%</div>
                    <div className="text-xl text-white/70">Average Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-900 mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Try our interactive demo to see how much you could save on your groceries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Try Demo Now
            </Link>
            <Link
              href="/partners"
              className="px-8 py-4 bg-white hover:bg-primary-50 text-primary-600 font-semibold rounded-xl transition-all border-2 border-primary-200 hover:border-primary-300"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
