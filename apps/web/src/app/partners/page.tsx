import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary-500 hover:text-primary-600 mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-primary-700">Partner with Subsidize</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-2xl font-semibold mb-4">Reach More Customers</h2>
          <p className="text-lg text-text-secondary">
            Join Bermuda's leading grocery price comparison platform
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-xl font-semibold mb-2">Increase Visibility</h3>
            <p className="text-text-secondary">
              Get discovered by thousands of shoppers looking for the best deals
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
            <p className="text-text-secondary">
              Understand your pricing position and optimize your competitiveness
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Target Promotions</h3>
            <p className="text-text-secondary">
              Highlight your weekly deals and special offers to interested customers
            </p>
          </Card>

          <Card>
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-xl font-semibold mb-2">Digital Integration</h3>
            <p className="text-text-secondary">
              Seamless connection between price discovery and in-store or online shopping
            </p>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-primary-500 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Interested in partnering?</h3>
          <p className="text-lg mb-6 opacity-90">
            Contact us to learn more about bringing your store to Subsidize
          </p>
          <Button className="bg-white text-primary-600 hover:bg-gray-100">
            Get in Touch
          </Button>
        </Card>

        {/* Partner Logos Placeholder */}
        <div className="mt-12">
          <h3 className="text-center text-lg font-semibold mb-6 text-text-secondary">
            Trusted by Bermuda's leading grocery stores
          </h3>
          <div className="grid grid-cols-3 gap-8 opacity-50">
            <Card className="aspect-video flex items-center justify-center">
              <span className="text-text-tertiary">Partner Logo</span>
            </Card>
            <Card className="aspect-video flex items-center justify-center">
              <span className="text-text-tertiary">Partner Logo</span>
            </Card>
            <Card className="aspect-video flex items-center justify-center">
              <span className="text-text-tertiary">Partner Logo</span>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
