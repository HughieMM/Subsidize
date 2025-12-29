import { z } from 'zod';

export const StoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  acceptsOnlineOrders: z.boolean().default(false),
  offersDelivery: z.boolean().default(false),
  deliveryFee: z.number().optional(),
  minimumOrderAmount: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const StoreLocationSchema = z.object({
  id: z.string(),
  storeId: z.string(),
  name: z.string(),
  address: z.string(),
  parish: z.string(), // Bermuda parishes
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phoneNumber: z.string().optional(),
  openingHours: z.record(z.string()).optional(), // { "monday": "8:00-20:00", ... }
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Store = z.infer<typeof StoreSchema>;
export type StoreLocation = z.infer<typeof StoreLocationSchema>;

export interface StoreWithLocations extends Store {
  locations: StoreLocation[];
}

// Bermuda parishes for reference
export const BermudaParishes = [
  'Devonshire',
  'Hamilton',
  'Paget',
  'Pembroke',
  'Sandys',
  'Smiths',
  'Southampton',
  'St. Georges',
  'Warwick',
] as const;

export type BermudaParish = (typeof BermudaParishes)[number];
