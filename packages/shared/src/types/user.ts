import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  emailVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(), // e.g., "Home", "Work"
  streetAddress: z.string(),
  parish: z.string(),
  postalCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type Address = z.infer<typeof AddressSchema>;

export interface UserWithAddresses extends User {
  addresses: Address[];
}
