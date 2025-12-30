import { Request, Response } from 'express';
import { prisma } from '../index';
import {
  calculatePriceStats,
  findBestStore,
  getPriceRange,
  calculateUnitPrice,
  parseSize,
  type PricePoint,
} from '@subsidize/shared';

export class ProductController {
  /**
   * GET /api/products
   * List all products with optional filters
   */
  async list(req: Request, res: Response) {
    try {
      const { page = '1', limit = '20', brand } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where = brand ? { brand: brand as string } : {};

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: { canonicalName: 'asc' },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
        total,
        page: parseInt(page as string),
        limit: take,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      console.error('Error listing products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  /**
   * GET /api/products/search?q=query
   * Search products by name or brand
   */
  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          error: 'Query parameter "q" is required',
        });
      }

      const searchTerm = q.toLowerCase();

      // Search in both canonical name and brand
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { canonicalName: { contains: searchTerm, mode: 'insensitive' } },
            { brand: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
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
        take: 50,
      });

      // Transform to include price information
      const results = products.map(product => {
        const prices = product.storeProducts
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

        return {
          id: product.id,
          canonicalName: product.canonicalName,
          brand: product.brand,
          sizeValue: product.sizeValue,
          sizeUnit: product.sizeUnit,
          prices,
          lowestPrice,
        };
      });

      res.json({
        query: q,
        results,
        total: results.length,
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Failed to search products' });
    }
  }

  /**
   * GET /api/products/:id
   * Get a specific product with all current prices across stores
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
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
      });

      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: `Product ${id} does not exist`,
        });
      }

      // Get all current prices
      const pricePoints: PricePoint[] = product.storeProducts
        .filter(sp => sp.priceObservations.length > 0)
        .map(sp => {
          const obs = sp.priceObservations[0];

          // Calculate unit price if not already in database
          let unitPrice = obs.unitPrice;
          let unitPriceUnit = obs.unitPriceUnit;

          if (!unitPrice && product.sizeValue && product.sizeUnit) {
            const calculated = calculateUnitPrice(
              obs.price,
              product.sizeValue,
              product.sizeUnit
            );
            if (calculated) {
              unitPrice = calculated.unitPrice;
              unitPriceUnit = calculated.unitPriceUnit;
            }
          }

          return {
            storeId: sp.storeId,
            storeName: sp.store.name,
            price: obs.price,
            currency: obs.currency,
            unitPrice,
            unitPriceUnit,
            observedAt: obs.observedAt,
          };
        });

      // Use comparison utilities
      const stats = calculatePriceStats(pricePoints);
      const bestStore = findBestStore(pricePoints);
      const priceRange = getPriceRange(pricePoints);

      res.json({
        product: {
          id: product.id,
          canonicalName: product.canonicalName,
          brand: product.brand,
          sizeValue: product.sizeValue,
          sizeUnit: product.sizeUnit,
          gtin: product.gtin,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
        prices: pricePoints,
        priceStats: stats,
        bestStore,
        priceRange,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  /**
   * GET /api/products/:id/prices
   * Get price history for a product across all stores
   */
  async getPriceHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { days = '30' } = req.query;

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
        });
      }

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

      // Get price observations for this product
      const storeProducts = await prisma.storeProduct.findMany({
        where: { productId: id },
        include: {
          store: true,
          priceObservations: {
            where: {
              observedAt: { gte: daysAgo },
            },
            orderBy: { observedAt: 'desc' },
          },
        },
      });

      const priceHistory = storeProducts.flatMap(sp =>
        sp.priceObservations.map(po => ({
          storeId: sp.storeId,
          storeName: sp.store.name,
          price: po.price,
          currency: po.currency,
          observedAt: po.observedAt,
          sourceType: po.sourceType,
        }))
      );

      res.json({
        productId: id,
        productName: product.canonicalName,
        days: parseInt(days as string),
        priceHistory,
        total: priceHistory.length,
      });
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  }
}
