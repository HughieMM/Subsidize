import { Request, Response } from 'express';
import { prisma } from '../index';

export class StoreController {
  /**
   * GET /api/stores
   * List all stores
   */
  async list(_req: Request, res: Response) {
    try {
      const stores = await prisma.store.findMany({
        orderBy: { name: 'asc' },
      });

      res.json({
        stores,
        total: stores.length,
      });
    } catch (error) {
      console.error('Error listing stores:', error);
      res.status(500).json({ error: 'Failed to fetch stores' });
    }
  }

  /**
   * GET /api/stores/:id
   * Get a specific store by ID
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const store = await prisma.store.findUnique({
        where: { id },
      });

      if (!store) {
        return res.status(404).json({
          error: 'Store not found',
          message: `Store ${id} does not exist`,
        });
      }

      res.json({ store });
    } catch (error) {
      console.error('Error fetching store:', error);
      res.status(500).json({ error: 'Failed to fetch store' });
    }
  }

  /**
   * GET /api/stores/:id/products
   * Get all products available at a specific store
   */
  async getProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verify store exists
      const store = await prisma.store.findUnique({
        where: { id },
      });

      if (!store) {
        return res.status(404).json({
          error: 'Store not found',
        });
      }

      // Get all products for this store with latest prices
      const storeProducts = await prisma.storeProduct.findMany({
        where: { storeId: id },
        include: {
          product: true,
          priceObservations: {
            orderBy: { observedAt: 'desc' },
            take: 1,
          },
        },
      });

      const products = storeProducts.map(sp => ({
        id: sp.product?.id,
        name: sp.rawName,
        canonicalName: sp.product?.canonicalName,
        brand: sp.product?.brand,
        size: sp.rawSize,
        sizeValue: sp.product?.sizeValue,
        sizeUnit: sp.product?.sizeUnit,
        currentPrice: sp.priceObservations[0]?.price,
        currency: sp.priceObservations[0]?.currency,
        lastUpdated: sp.priceObservations[0]?.observedAt,
      }));

      res.json({
        storeId: id,
        storeName: store.name,
        products,
        total: products.length,
      });
    } catch (error) {
      console.error('Error fetching store products:', error);
      res.status(500).json({ error: 'Failed to fetch store products' });
    }
  }
}
