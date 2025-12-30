import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-700 mb-6">
            Subsidize
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-8">
            Compare grocery prices across Bermuda stores and save money
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="large">Try Demo</Button>
            </Link>
            <Link href="/partners">
              <Button size="large" variant="outline">
                For Stores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Search Products</h3>
                <p className="text-text-secondary">
                  Find any grocery item across all major Bermuda stores
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Compare Prices</h3>
                <p className="text-text-secondary">
                  See prices side-by-side and find the best deals instantly
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold mb-2">Build Your Basket</h3>
                <p className="text-text-secondary">
                  Add items and we'll show you the cheapest store for your full basket
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-primary-500 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to start saving?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of Bermudians finding better grocery deals
            </p>
            <Link href="/demo">
              <Button variant="outline" size="large" className="bg-white text-primary-600">
                Try It Now
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}
