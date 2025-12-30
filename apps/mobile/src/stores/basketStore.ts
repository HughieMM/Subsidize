import { create } from 'zustand';
import { ProductWithPrices } from '@subsidize/shared';

export interface BasketItem {
  product: ProductWithPrices;
  quantity: number;
  storeId: string; // Which store to buy from
}

interface BasketStore {
  items: BasketItem[];
  addItem: (product: ProductWithPrices, storeId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalByStore: (storeId: string) => number;
  getAllTotals: () => Array<{ storeId: string; total: number; itemCount: number }>;
  getBestStore: () => { storeId: string; total: number } | null;
}

export const useBasketStore = create<BasketStore>((set, get) => ({
  items: [],

  addItem: (product, storeId) => {
    const existingItem = get().items.find(item => item.product.id === product.id);

    if (existingItem) {
      set({
        items: get().items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...get().items, { product, quantity: 1, storeId }] });
    }
  },

  removeItem: productId => {
    set({ items: get().items.filter(item => item.product.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
    } else {
      set({
        items: get().items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },

  clearBasket: () => {
    set({ items: [] });
  },

  getTotalByStore: storeId => {
    return get().items.reduce((total, item) => {
      const price = item.product.prices.find(p => p.storeId === storeId);
      if (price) {
        const itemPrice = price.isOnSale && price.salePrice ? price.salePrice : price.price;
        return total + itemPrice * item.quantity;
      }
      return total;
    }, 0);
  },

  getAllTotals: () => {
    const items = get().items;
    const storeTotals = new Map<string, { total: number; itemCount: number }>();

    // Get all unique store IDs
    const storeIds = new Set<string>();
    items.forEach(item => {
      item.product.prices.forEach(price => {
        storeIds.add(price.storeId);
      });
    });

    // Calculate totals for each store
    storeIds.forEach(storeId => {
      let total = 0;
      let itemCount = 0;

      items.forEach(item => {
        const price = item.product.prices.find(p => p.storeId === storeId);
        if (price) {
          const itemPrice = price.isOnSale && price.salePrice ? price.salePrice : price.price;
          total += itemPrice * item.quantity;
          itemCount += item.quantity;
        }
      });

      if (itemCount > 0) {
        storeTotals.set(storeId, { total, itemCount });
      }
    });

    return Array.from(storeTotals.entries()).map(([storeId, data]) => ({
      storeId,
      ...data,
    }));
  },

  getBestStore: () => {
    const totals = get().getAllTotals();
    if (totals.length === 0) return null;

    return totals.reduce((best, current) => {
      return current.total < best.total ? current : best;
    });
  },
}));
