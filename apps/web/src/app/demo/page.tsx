'use client';

import { useState } from 'react';
import { mockProducts, mockStores, formatPrice } from '@subsidize/shared';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function DemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [basket, setBasket] = useState<Map<string, number>>(new Map());

  // Filter products based on search
  const filteredProducts = searchQuery
    ? mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockProducts;

  // Calculate basket totals per store
  const basketTotals = mockStores.map(store => {
    let total = 0;
    let itemCount = 0;

    basket.forEach((quantity, productId) => {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        const price = product.prices.find(p => p.storeId === store.id);
        if (price) {
          const itemPrice = price.isOnSale && price.salePrice ? price.salePrice : price.price;
          total += itemPrice * quantity;
          itemCount += quantity;
        }
      }
    });

    return {
      store,
      total,
      itemCount,
    };
  }).filter(t => t.itemCount > 0);

  const bestStore = basketTotals.length > 0
    ? basketTotals.reduce((best, current) => (current.total < best.total ? current : best))
    : null;

  const addToBasket = (productId: string) => {
    const newBasket = new Map(basket);
    newBasket.set(productId, (newBasket.get(productId) || 0) + 1);
    setBasket(newBasket);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-primary-700 mb-4">Subsidize Demo</h1>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search groceries..."
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              {searchQuery ? `Search Results (${filteredProducts.length})` : 'All Products'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  <Button
                    onClick={() => addToBasket(product.id)}
                    size="small"
                    className="w-full mt-2"
                  >
                    Add to Basket
                  </Button>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <Card>
                <div className="text-center py-12 text-text-secondary">
                  <p>No products found</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              </Card>
            )}
          </div>

          {/* Basket Section */}
          <div>
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">
                My Basket ({Array.from(basket.values()).reduce((a, b) => a + b, 0)} items)
              </h2>

              {basketTotals.length === 0 ? (
                <Card>
                  <div className="text-center py-8 text-text-secondary">
                    <div className="text-4xl mb-2">🛒</div>
                    <p>Your basket is empty</p>
                    <p className="text-sm mt-2">Add items to compare prices</p>
                  </div>
                </Card>
              ) : (
                <>
                  {/* Store Totals */}
                  <div className="space-y-3 mb-4">
                    {basketTotals.map(({ store, total, itemCount }) => (
                      <Card
                        key={store.id}
                        className={
                          bestStore?.store.id === store.id
                            ? 'border-2 border-success'
                            : ''
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{store.name}</h3>
                            <p className="text-sm text-text-secondary">
                              {itemCount} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary-600">
                              {formatPrice(total)}
                            </p>
                            {bestStore?.store.id === store.id && (
                              <p className="text-xs text-success font-medium">
                                Best Price!
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Best Store CTA */}
                  {bestStore && (
                    <Card className="bg-success text-white">
                      <h3 className="font-bold mb-2">💚 Shop at {bestStore.store.name}</h3>
                      <p className="text-sm mb-3 opacity-90">
                        Save {formatPrice(
                          Math.max(...basketTotals.map(t => t.total)) - bestStore.total
                        )}{' '}
                        compared to the most expensive store
                      </p>
                      <Button className="w-full bg-white text-success hover:bg-gray-100">
                        Start Shopping
                      </Button>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
