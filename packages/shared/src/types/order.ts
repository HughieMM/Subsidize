import { z } from 'zod';

export const OrderStatus = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'cancelled',
]);

export const OrderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  storeId: z.string(),
  status: OrderStatus,
  subtotal: z.number(),
  deliveryFee: z.number().default(0),
  tax: z.number().default(0),
  total: z.number(),
  deliveryAddressId: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  estimatedDeliveryTime: z.date().optional(),
  actualDeliveryTime: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
