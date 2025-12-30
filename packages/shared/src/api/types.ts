import { z } from 'zod';

// API Response Types
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.array(z.any()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Store Types
export const ApiStoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  websiteUrl: z.string().nullable(),
  supportsDelivery: z.boolean(),
  parishes: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ApiStoresResponseSchema = z.object({
  stores: z.array(ApiStoreSchema),
  total: z.number(),
});

export type ApiStore = z.infer<typeof ApiStoreSchema>;
export type ApiStoresResponse = z.infer<typeof ApiStoresResponseSchema>;

// Product Types
export const ApiPriceInfoSchema = z.object({
  storeId: z.string(),
  storeName: z.string(),
  price: z.number(),
  currency: z.string(),
  unitPrice: z.number().nullable().optional(),
  unitPriceUnit: z.string().nullable().optional(),
  observedAt: z.string(),
});

export const ApiProductSearchResultSchema = z.object({
  id: z.string(),
  canonicalName: z.string(),
  brand: z.string().nullable(),
  sizeValue: z.number().nullable(),
  sizeUnit: z.string().nullable(),
  prices: z.array(ApiPriceInfoSchema),
  lowestPrice: ApiPriceInfoSchema.nullable(),
});

export const ApiProductSearchResponseSchema = z.object({
  query: z.string(),
  results: z.array(ApiProductSearchResultSchema),
  total: z.number(),
});

export const ApiProductDetailSchema = z.object({
  product: z.object({
    id: z.string(),
    canonicalName: z.string(),
    brand: z.string().nullable(),
    sizeValue: z.number().nullable(),
    sizeUnit: z.string().nullable(),
    gtin: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  prices: z.array(ApiPriceInfoSchema),
  priceStats: z.object({
    min: z.number(),
    max: z.number(),
    median: z.number(),
    average: z.number(),
    range: z.number(),
    storeCount: z.number(),
  }).nullable(),
  bestStore: z.object({
    storeId: z.string(),
    storeName: z.string(),
    price: z.number(),
    savings: z.number(),
  }).nullable(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
    formatted: z.string(),
  }).nullable(),
});

export const ApiPriceHistoryEntrySchema = z.object({
  storeId: z.string(),
  storeName: z.string(),
  price: z.number(),
  currency: z.string(),
  observedAt: z.string(),
  sourceType: z.string(),
});

export const ApiPriceHistoryResponseSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  days: z.number(),
  priceHistory: z.array(ApiPriceHistoryEntrySchema),
  total: z.number(),
});

export type ApiPriceInfo = z.infer<typeof ApiPriceInfoSchema>;
export type ApiProductSearchResult = z.infer<typeof ApiProductSearchResultSchema>;
export type ApiProductSearchResponse = z.infer<typeof ApiProductSearchResponseSchema>;
export type ApiProductDetail = z.infer<typeof ApiProductDetailSchema>;
export type ApiPriceHistoryEntry = z.infer<typeof ApiPriceHistoryEntrySchema>;
export type ApiPriceHistoryResponse = z.infer<typeof ApiPriceHistoryResponseSchema>;

// Basket Types
export const ApiBasketItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  brand: z.string().nullable(),
  quantity: z.number(),
  prices: z.array(ApiPriceInfoSchema),
});

export const ApiBasketSchema = z.object({
  basket: z.object({
    id: z.string(),
    userId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    items: z.array(ApiBasketItemSchema),
  }),
});

export const ApiStoreComparisonSchema = z.object({
  storeId: z.string(),
  storeName: z.string(),
  total: z.number(),
  currency: z.string(),
  availableItems: z.number(),
  totalItems: z.number(),
  missingProducts: z.array(z.string()),
  hasAllProducts: z.boolean(),
});

export const ApiBasketComparisonResponseSchema = z.object({
  basketId: z.string(),
  itemCount: z.number(),
  storeComparisons: z.array(ApiStoreComparisonSchema),
  bestStore: ApiStoreComparisonSchema.nullable(),
});

export type ApiBasketItem = z.infer<typeof ApiBasketItemSchema>;
export type ApiBasket = z.infer<typeof ApiBasketSchema>;
export type ApiStoreComparison = z.infer<typeof ApiStoreComparisonSchema>;
export type ApiBasketComparisonResponse = z.infer<typeof ApiBasketComparisonResponseSchema>;

// Watchlist Types
export const ApiWatchlistItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  brand: z.string().nullable(),
  targetPrice: z.number().nullable(),
  currentLowestPrice: ApiPriceInfoSchema.nullable(),
  hasAlert: z.boolean(),
  prices: z.array(ApiPriceInfoSchema),
  createdAt: z.string(),
});

export const ApiWatchlistResponseSchema = z.object({
  userId: z.string(),
  watchlist: z.array(ApiWatchlistItemSchema),
  total: z.number(),
});

export type ApiWatchlistItem = z.infer<typeof ApiWatchlistItemSchema>;
export type ApiWatchlistResponse = z.infer<typeof ApiWatchlistResponseSchema>;
