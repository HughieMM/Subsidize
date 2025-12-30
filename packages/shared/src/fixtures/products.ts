import { ProductWithPrices, Price } from '../types/product';

const now = new Date();

// Helper to create prices for a product across stores
function createPrices(productId: string, prices: Array<{ storeId: string; price: number; isOnSale?: boolean; salePrice?: number }>): Price[] {
  return prices.map((p, index) => ({
    id: `price-${productId}-${index}`,
    productId,
    storeId: p.storeId,
    price: p.price,
    currency: 'BMD',
    isOnSale: p.isOnSale || false,
    salePrice: p.salePrice,
    saleStartDate: p.isOnSale ? new Date(now.getTime() - 86400000 * 2) : undefined,
    saleEndDate: p.isOnSale ? new Date(now.getTime() + 86400000 * 5) : undefined,
    inStock: true,
    scrapedAt: now,
    createdAt: now,
    updatedAt: now,
  }));
}

export const mockProducts: ProductWithPrices[] = [
  {
    id: 'prod-1',
    name: 'Organic Bananas',
    description: 'Fresh organic bananas from local farms',
    category: 'Produce',
    brand: 'Local Farms',
    imageUrl: undefined,
    unit: 'lb',
    barcode: '1234567890001',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-1', [
      { storeId: 'store-1', price: 1.99 },
      { storeId: 'store-2', price: 1.79, isOnSale: true, salePrice: 1.49 },
      { storeId: 'store-3', price: 2.29 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-2',
    name: 'Whole Milk',
    description: 'Fresh whole milk, 1 gallon',
    category: 'Dairy',
    brand: 'Bermuda Dairy',
    imageUrl: undefined,
    unit: 'gallon',
    barcode: '1234567890002',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-2', [
      { storeId: 'store-1', price: 8.99 },
      { storeId: 'store-2', price: 8.49 },
      { storeId: 'store-3', price: 7.99 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-3',
    name: 'White Bread',
    description: 'Soft white sandwich bread',
    category: 'Bakery',
    brand: 'Island Bakery',
    imageUrl: undefined,
    unit: 'loaf',
    barcode: '1234567890003',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-3', [
      { storeId: 'store-1', price: 4.99 },
      { storeId: 'store-2', price: 4.49 },
      { storeId: 'store-3', price: 4.79 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-4',
    name: 'Cage-Free Eggs',
    description: 'Large cage-free eggs, 12 pack',
    category: 'Dairy',
    brand: 'Happy Hens',
    imageUrl: undefined,
    unit: 'dozen',
    barcode: '1234567890004',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-4', [
      { storeId: 'store-1', price: 6.99, isOnSale: true, salePrice: 5.99 },
      { storeId: 'store-2', price: 7.49 },
      { storeId: 'store-3', price: 6.79 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-5',
    name: 'Fresh Chicken Breast',
    description: 'Boneless, skinless chicken breast',
    category: 'Meat',
    brand: 'Premium Poultry',
    imageUrl: undefined,
    unit: 'lb',
    barcode: '1234567890005',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-5', [
      { storeId: 'store-1', price: 9.99 },
      { storeId: 'store-2', price: 10.49 },
      { storeId: 'store-3', price: 9.49 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-6',
    name: 'Pasta Penne',
    description: 'Italian penne pasta, 16oz',
    category: 'Pantry',
    brand: 'Barilla',
    imageUrl: undefined,
    unit: 'box',
    barcode: '1234567890006',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-6', [
      { storeId: 'store-1', price: 2.99 },
      { storeId: 'store-2', price: 3.29 },
      { storeId: 'store-3', price: 2.79, isOnSale: true, salePrice: 2.29 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-7',
    name: 'Tomato Sauce',
    description: 'Classic marinara sauce, 24oz jar',
    category: 'Pantry',
    brand: 'Rao\'s',
    imageUrl: undefined,
    unit: 'jar',
    barcode: '1234567890007',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-7', [
      { storeId: 'store-1', price: 8.99 },
      { storeId: 'store-2', price: 9.49 },
      { storeId: 'store-3', price: 8.49 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-8',
    name: 'Orange Juice',
    description: 'Fresh squeezed orange juice, 64oz',
    category: 'Beverages',
    brand: 'Tropicana',
    imageUrl: undefined,
    unit: 'bottle',
    barcode: '1234567890008',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-8', [
      { storeId: 'store-1', price: 7.49 },
      { storeId: 'store-2', price: 6.99, isOnSale: true, salePrice: 5.99 },
      { storeId: 'store-3', price: 7.99 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-9',
    name: 'Cheddar Cheese',
    description: 'Sharp cheddar cheese, 8oz block',
    category: 'Dairy',
    brand: 'Cabot',
    imageUrl: undefined,
    unit: 'block',
    barcode: '1234567890009',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-9', [
      { storeId: 'store-1', price: 5.99 },
      { storeId: 'store-2', price: 6.49 },
      { storeId: 'store-3', price: 5.79 },
    ]),
    lowestPrice: undefined,
  },
  {
    id: 'prod-10',
    name: 'Baby Spinach',
    description: 'Fresh baby spinach, 5oz container',
    category: 'Produce',
    brand: 'Organic Greens',
    imageUrl: undefined,
    unit: 'container',
    barcode: '1234567890010',
    createdAt: now,
    updatedAt: now,
    prices: createPrices('prod-10', [
      { storeId: 'store-1', price: 4.49 },
      { storeId: 'store-2', price: 4.99 },
      { storeId: 'store-3', price: 4.29, isOnSale: true, salePrice: 3.99 },
    ]),
    lowestPrice: undefined,
  },
];

// Calculate lowest price for each product
mockProducts.forEach(product => {
  if (product.prices.length > 0) {
    product.lowestPrice = product.prices.reduce((lowest, current) => {
      const currentPrice = current.isOnSale && current.salePrice ? current.salePrice : current.price;
      const lowestPrice = lowest.isOnSale && lowest.salePrice ? lowest.salePrice : lowest.price;
      return currentPrice < lowestPrice ? current : lowest;
    });
  }
});
