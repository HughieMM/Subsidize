import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';

const addWatchlistSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  targetPrice: z.number().positive().optional(),
});

const updateTargetPriceSchema = z.object({
  targetPrice: z.number().positive().nullable(),
});

export class WatchlistController {
  /**
   * POST /api/watchlist
   * Add product to user's watchlist
   */
  async add(req: Request, res: Response) {
    try {
      const data = addWatchlistSchema.parse(req.body);

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
        });
      }

      // Check if already in watchlist
      const existing = await prisma.watchlist.findUnique({
        where: {
          userId_productId: {
            userId: data.userId,
            productId: data.productId,
          },
        },
      });

      if (existing) {
        return res.status(400).json({
          error: 'Product already in watchlist',
        });
      }

      // Add to watchlist
      const watchlistItem = await prisma.watchlist.create({
        data: {
          userId: data.userId,
          productId: data.productId,
          targetPrice: data.targetPrice,
        },
      });

      res.status(201).json({
        watchlistItem,
        message: 'Product added to watchlist successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      console.error('Error adding to watchlist:', error);
      res.status(500).json({ error: 'Failed to add to watchlist' });
    }
  }

  /**
   * GET /api/watchlist/user/:userId
   * Get user's watchlist with current prices
   */
  async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      const watchlist = await prisma.watchlist.findMany({
        where: { userId },
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
        orderBy: { createdAt: 'desc' },
      });

      // Transform to include current prices and alerts
      const items = watchlist.map(item => {
        const prices = item.product.storeProducts
          .filter(sp => sp.priceObservations.length > 0)
          .map(sp => ({
            storeId: sp.storeId,
            storeName: sp.store.name,
            price: sp.priceObservations[0].price,
            currency: sp.priceObservations[0].currency,
            observedAt: sp.priceObservations[0].observedAt,
          }));

        const lowestPrice = prices.length > 0
          ? prices.reduce((min, p) => (p.price < min.price ? p : min))
          : null;

        const hasAlert = item.targetPrice && lowestPrice
          ? lowestPrice.price <= item.targetPrice
          : false;

        return {
          id: item.id,
          productId: item.productId,
          productName: item.product.canonicalName,
          brand: item.product.brand,
          targetPrice: item.targetPrice,
          currentLowestPrice: lowestPrice,
          hasAlert,
          prices,
          createdAt: item.createdAt,
        };
      });

      res.json({
        userId,
        watchlist: items,
        total: items.length,
      });
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
  }

  /**
   * DELETE /api/watchlist/:id
   * Remove product from watchlist
   */
  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const watchlistItem = await prisma.watchlist.findUnique({
        where: { id },
      });

      if (!watchlistItem) {
        return res.status(404).json({
          error: 'Watchlist item not found',
        });
      }

      await prisma.watchlist.delete({
        where: { id },
      });

      res.json({
        message: 'Product removed from watchlist successfully',
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      res.status(500).json({ error: 'Failed to remove from watchlist' });
    }
  }

  /**
   * PATCH /api/watchlist/:id/target-price
   * Update target price for watchlist item
   */
  async updateTargetPrice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateTargetPriceSchema.parse(req.body);

      const watchlistItem = await prisma.watchlist.findUnique({
        where: { id },
      });

      if (!watchlistItem) {
        return res.status(404).json({
          error: 'Watchlist item not found',
        });
      }

      const updated = await prisma.watchlist.update({
        where: { id },
        data: {
          targetPrice: data.targetPrice,
        },
      });

      res.json({
        watchlistItem: updated,
        message: 'Target price updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      console.error('Error updating target price:', error);
      res.status(500).json({ error: 'Failed to update target price' });
    }
  }
}
