import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fee configuration from environment
const DEFAULT_DELIVERY_FEE = parseFloat(process.env.DEFAULT_DELIVERY_FEE || '5.00');
const COMMISSION_PERCENT = parseFloat(process.env.COMMISSION_PERCENT || '15');
const SERVICE_FEE = parseFloat(process.env.SERVICE_FEE || '2.50');

interface BasketSnapshot {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    storeId: string;
    storeName: string;
  }>;
  timestamp: string;
}

interface FeeBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  commissionPercent: number;
  commission: number;
  total: number;
}

export class DeliveryController {
  /**
   * Create a new delivery order
   * POST /api/delivery/orders
   */
  async createOrder(req: Request, res: Response) {
    try {
      const {
        basketId,
        userId,
        deliveryAddress,
        timeWindow,
        notes,
      } = req.body;

      // Validate required fields
      if (!basketId || !deliveryAddress) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'basketId and deliveryAddress are required',
        });
      }

      // Fetch basket with items and prices
      const basket = await prisma.basket.findUnique({
        where: { id: basketId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  storeProducts: {
                    include: {
                      store: true,
                      priceObservations: {
                        orderBy: { observedAt: 'desc' },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!basket) {
        return res.status(404).json({
          error: 'Basket not found',
          message: `No basket found with id: ${basketId}`,
        });
      }

      if (basket.items.length === 0) {
        return res.status(400).json({
          error: 'Empty basket',
          message: 'Cannot create order with empty basket',
        });
      }

      // Create basket snapshot with current prices
      const basketSnapshot: BasketSnapshot = {
        items: basket.items.map((item) => {
          // Get the latest price from the first store product
          const storeProduct = item.product.storeProducts[0];
          const latestPrice = storeProduct?.priceObservations[0];

          return {
            productId: item.productId,
            productName: item.product.canonicalName,
            quantity: item.quantity,
            price: latestPrice?.price || 0,
            storeId: storeProduct?.storeId || '',
            storeName: storeProduct?.store?.name || 'Unknown',
          };
        }),
        timestamp: new Date().toISOString(),
      };

      // Calculate fees
      const subtotal = basketSnapshot.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const commission = (subtotal * COMMISSION_PERCENT) / 100;

      const feeBreakdown: FeeBreakdown = {
        subtotal,
        deliveryFee: DEFAULT_DELIVERY_FEE,
        serviceFee: SERVICE_FEE,
        commissionPercent: COMMISSION_PERCENT,
        commission,
        total: subtotal + DEFAULT_DELIVERY_FEE + SERVICE_FEE,
      };

      // Create delivery order
      const order = await prisma.deliveryOrder.create({
        data: {
          userId: userId || null,
          basketSnapshotJson: JSON.stringify(basketSnapshot),
          feeBreakdownJson: JSON.stringify(feeBreakdown),
          deliveryAddress,
          timeWindow: timeWindow || null,
          notes: notes || null,
          status: 'created',
        },
      });

      res.status(201).json({
        order: {
          id: order.id,
          status: order.status,
          basketSnapshot,
          feeBreakdown,
          deliveryAddress: order.deliveryAddress,
          timeWindow: order.timeWindow,
          notes: order.notes,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      console.error('Error creating delivery order:', error);
      res.status(500).json({
        error: 'Failed to create delivery order',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get order by ID
   * GET /api/delivery/orders/:id
   */
  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await prisma.deliveryOrder.findUnique({
        where: { id },
      });

      if (!order) {
        return res.status(404).json({
          error: 'Order not found',
          message: `No order found with id: ${id}`,
        });
      }

      res.json({
        order: {
          id: order.id,
          status: order.status,
          basketSnapshot: JSON.parse(order.basketSnapshotJson),
          feeBreakdown: JSON.parse(order.feeBreakdownJson),
          deliveryAddress: order.deliveryAddress,
          timeWindow: order.timeWindow,
          notes: order.notes,
          driverId: order.driverId,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        error: 'Failed to fetch order',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * List orders with optional filters
   * GET /api/delivery/orders
   */
  async listOrders(req: Request, res: Response) {
    try {
      const {
        status,
        userId,
        driverId,
        limit = '50',
      } = req.query;

      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (userId) {
        where.userId = userId;
      }

      if (driverId) {
        where.driverId = driverId;
      }

      const orders = await prisma.deliveryOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
      });

      res.json({
        orders: orders.map((order) => ({
          id: order.id,
          status: order.status,
          basketSnapshot: JSON.parse(order.basketSnapshotJson),
          feeBreakdown: JSON.parse(order.feeBreakdownJson),
          deliveryAddress: order.deliveryAddress,
          timeWindow: order.timeWindow,
          notes: order.notes,
          driverId: order.driverId,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })),
        total: orders.length,
      });
    } catch (error) {
      console.error('Error listing orders:', error);
      res.status(500).json({
        error: 'Failed to list orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update order status
   * PATCH /api/delivery/orders/:id/status
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, driverId } = req.body;

      // Validate status
      const validStatuses = [
        'created',
        'accepted',
        'shopping',
        'delivering',
        'complete',
        'cancelled',
      ];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Invalid status',
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        });
      }

      // Fetch current order
      const order = await prisma.deliveryOrder.findUnique({
        where: { id },
      });

      if (!order) {
        return res.status(404).json({
          error: 'Order not found',
          message: `No order found with id: ${id}`,
        });
      }

      // Update order
      const updateData: any = { status };

      // If status is 'accepted', set driverId
      if (status === 'accepted' && driverId) {
        updateData.driverId = driverId;
      }

      const updatedOrder = await prisma.deliveryOrder.update({
        where: { id },
        data: updateData,
      });

      res.json({
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status,
          driverId: updatedOrder.driverId,
          updatedAt: updatedOrder.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        error: 'Failed to update order status',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Accept order (for drivers)
   * POST /api/delivery/orders/:id/accept
   */
  async acceptOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { driverId } = req.body;

      if (!driverId) {
        return res.status(400).json({
          error: 'Missing driverId',
          message: 'driverId is required to accept an order',
        });
      }

      const order = await prisma.deliveryOrder.findUnique({
        where: { id },
      });

      if (!order) {
        return res.status(404).json({
          error: 'Order not found',
        });
      }

      if (order.status !== 'created') {
        return res.status(400).json({
          error: 'Order cannot be accepted',
          message: `Order is already ${order.status}`,
        });
      }

      const updatedOrder = await prisma.deliveryOrder.update({
        where: { id },
        data: {
          status: 'accepted',
          driverId,
        },
      });

      res.json({
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status,
          driverId: updatedOrder.driverId,
          basketSnapshot: JSON.parse(updatedOrder.basketSnapshotJson),
          feeBreakdown: JSON.parse(updatedOrder.feeBreakdownJson),
          deliveryAddress: updatedOrder.deliveryAddress,
          timeWindow: updatedOrder.timeWindow,
          notes: updatedOrder.notes,
          updatedAt: updatedOrder.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error accepting order:', error);
      res.status(500).json({
        error: 'Failed to accept order',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
