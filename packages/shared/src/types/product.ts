import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  unit: z.string(), // e.g., "each", "lb", "kg", "oz"
  barcode: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PriceSchema = z.object({
  id: z.string(),
  productId: z.string(),
  storeId: z.string(),
  price: z.number(),
  currency: z.string().default('BMD'), // Bermuda Dollar
  isOnSale: z.boolean().default(false),
  salePrice: z.number().optional(),
  saleStartDate: z.date().optional(),
  saleEndDate: z.date().optional(),
  inStock: z.boolean().default(true),
  scrapedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Price = z.infer<typeof PriceSchema>;

export interface ProductWithPrices extends Product {
  prices: Price[];
  lowestPrice?: Price;
}
