'use client';

import { useState, useEffect } from 'react';
import {
  mockProducts,
  mockStores,
  formatPrice,
  useProductSearch,
  useStores,
  useCreateBasket,
  useAddBasketItem,
  useBasket,
  useBasketComparison,
  type ApiProductSearchResult,
  type ApiStore,
} from '@subsidize/shared';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { apiClient, USE_MOCKS } from '@/lib/api';

export default function DemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [basketId, setBasketId] = useState<string | null>(null);

  // API hooks (only used when not in mock mode)
  const { data: searchResults, isLoading: isSearching } = useProductSearch(
    apiClient,
    searchQuery
  );
  const { data: storesData } = useStores(apiClient);
  const createBasket = useCreateBasket(apiClient);
  const addItem = useAddBasketItem(apiClient);
  const { data: basketData } = useBasket(apiClient, basketId);
  const { data: comparisonData } = useBasketComparison(apiClient, basketId);

  // Mock mode state
  const [mockBasket, setMockBasket] = useState<Map<string, number>>(new Map());

  // Create basket on mount (API mode only)
  useEffect(() => {
    if (!USE_MOCKS && !basketId) {
      createBasket.mutate(undefined, {
        onSuccess: (data) => {
          setBasketId(data.basket.id);
        },
      });
    }
  }, [basketId]);

  // Determine which data to use
  const products = USE_MOCKS
    ? searchQuery
      ? mockProducts.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : mockProducts
    : searchResults?.results || [];

  const stores = USE_MOCKS ? mockStores : storesData?.stores || [];

  // Mock mode basket calculation
  const mockBasketTotals = USE_MOCKS
    ? mockStores
        .map((store) => {
          let total = 0;
          let itemCount = 0;

          mockBasket.forEach((quantity, productId) => {
            const product = mockProducts.find((p) => p.id === productId);
            if (product) {
              const price = product.prices.find((p) => p.storeId === store.id);
              if (price) {
                const itemPrice =
                  price.isOnSale && price.salePrice
                    ? price.salePrice
                    : price.price;
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
        })
        .filter((t) => t.itemCount > 0)
    : [];

  const mockBestStore =
    mockBasketTotals.length > 0
      ? mockBasketTotals.reduce((best, current) =>
          current.total < best.total ? current : best
        )
      : null;

  // API mode data
  const apiBasketItems = basketData?.basket?.items || [];
  const apiComparisons = comparisonData?.storeComparisons || [];
  const apiBestStore = comparisonData?.bestStore;

  // Combined basket count
  const basketCount = USE_MOCKS
    ? Array.from(mockBasket.values()).reduce((a, b) => a + b, 0)
    : apiBasketItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToBasket = (productId: string) => {
    if (USE_MOCKS) {
      const newBasket = new Map(mockBasket);
      newBasket.set(productId, (newBasket.get(productId) || 0) + 1);
      setMockBasket(newBasket);
    } else if (basketId) {
      addItem.mutate({ basketId, productId, quantity: 1 });
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary-700">
              Subsidize Demo
            </h1>
            {USE_MOCKS && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Mock Mode
              </span>
            )}
          </div>
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
              {searchQuery
                ? `Search Results (${products.length})`
                : 'All Products'}
            </h2>

            {isSearching && !USE_MOCKS && (
              <Card>
                <div className="text-center py-8 text-text-secondary">
                  Loading products...
                </div>
              </Card>
            )}

            {!isSearching && products.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {products.map((product: any) => (
                  <div key={product.id}>
                    <ProductCard
                      product={
                        USE_MOCKS
                          ? product
                          : {
                              id: product.id,
                              name: product.canonicalName,
                              brand: product.brand,
                              prices: product.prices.map((p: any) => ({
                                storeId: p.storeId,
                                storeName: p.storeName,
                                price: p.price,
                                currency: p.currency,
                              })),
                              lowestPrice: product.lowestPrice,
                            }
                      }
                    />
                    <Button
                      onClick={() => handleAddToBasket(product.id)}
                      size="small"
                      className="w-full mt-2"
                      disabled={!USE_MOCKS && !basketId}
                    >
                      Add to Basket
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {products.length === 0 && !isSearching && (
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
                My Basket ({basketCount} items)
              </h2>

              {basketCount === 0 ? (
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
                    {USE_MOCKS
                      ? mockBasketTotals.map(({ store, total, itemCount }) => (
                          <Card
                            key={store.id}
                            className={
                              mockBestStore?.store.id === store.id
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
                                {mockBestStore?.store.id === store.id && (
                                  <p className="text-xs text-success font-medium">
                                    Best Price!
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))
                      : apiComparisons.map((comp) => (
                          <Card
                            key={comp.storeId}
                            className={
                              apiBestStore?.storeId === comp.storeId
                                ? 'border-2 border-success'
                                : ''
                            }
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">
                                  {comp.storeName}
                                </h3>
                                <p className="text-sm text-text-secondary">
                                  {comp.availableItems} items
                                </p>
                                {!comp.hasAllProducts && (
                                  <p className="text-xs text-orange-600">
                                    Missing {comp.missingProducts.length}{' '}
                                    product(s)
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary-600">
                                  {formatPrice(comp.total)}
                                </p>
                                {apiBestStore?.storeId === comp.storeId && (
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
                  {(USE_MOCKS ? mockBestStore : apiBestStore) && (
                    <Card className="bg-success text-white">
                      <h3 className="font-bold mb-2">
                        💚 Shop at{' '}
                        {USE_MOCKS
                          ? mockBestStore?.store.name
                          : apiBestStore?.storeName}
                      </h3>
                      <p className="text-sm mb-3 opacity-90">
                        {USE_MOCKS
                          ? `Save ${formatPrice(
                              Math.max(...mockBasketTotals.map((t) => t.total)) -
                                mockBestStore!.total
                            )} compared to the most expensive store`
                          : `Best overall price for your basket`}
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
