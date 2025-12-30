import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';

const createBasketSchema = z.object({
  userId: z.string().optional(),
});

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export class BasketController {
  /**
   * POST /api/baskets
   * Create a new basket
   */
  async create(req: Request, res: Response) {
    try {
      const data = createBasketSchema.parse(req.body);

      const basket = await prisma.basket.create({
        data: {
          userId: data.userId,
        },
      });

      res.status(201).json({
        basket,
        message: 'Basket created successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      console.error('Error creating basket:', error);
      res.status(500).json({ error: 'Failed to create basket' });
    }
  }

  /**
   * GET /api/baskets/:id
   * Get basket with all items and current prices
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const basket = await prisma.basket.findUnique({
        where: { id },
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
        });
      }

      // Transform to include current prices
      const items = basket.items.map(item => {
        const prices = item.product.storeProducts
          .filter(sp => sp.priceObservations.length > 0)
          .map(sp => ({
            storeId: sp.storeId,
            storeName: sp.store.name,
            price: sp.priceObservations[0].price,
            currency: sp.priceObservations[0].currency,
          }));

        return {
          id: item.id,
          productId: item.productId,
          productName: item.product.canonicalName,
          brand: item.product.brand,
          quantity: item.quantity,
          prices,
        };
      });

      res.json({
        basket: {
          id: basket.id,
          userId: basket.userId,
          createdAt: basket.createdAt,
          updatedAt: basket.updatedAt,
          items,
        },
      });
    } catch (error) {
      console.error('Error fetching basket:', error);
      res.status(500).json({ error: 'Failed to fetch basket' });
    }
  }

  /**
   * POST /api/baskets/:id/items
   * Add item to basket
   */
  async addItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = addItemSchema.parse(req.body);

      // Verify basket exists
      const basket = await prisma.basket.findUnique({
        where: { id },
      });

      if (!basket) {
        return res.status(404).json({
          error: 'Basket not found',
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

      // Check if item already exists in basket
      const existingItem = await prisma.basketItem.findUnique({
        where: {
          basketId_productId: {
            basketId: id,
            productId: data.productId,
          },
        },
      });

      let basketItem;
      if (existingItem) {
        // Update quantity
        basketItem = await prisma.basketItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + data.quantity,
          },
        });
      } else {
        // Create new item
        basketItem = await prisma.basketItem.create({
          data: {
            basketId: id,
            productId: data.productId,
            quantity: data.quantity,
          },
        });
      }

      res.json({
        basketItem,
        message: 'Item added to basket successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      console.error('Error adding item to basket:', error);
      res.status(500).json({ error: 'Failed to add item to basket' });
    }
  }

  /**
   * PATCH /api/baskets/:id/items/:productId
   * Update item quantity
   */
  async updateItem(req: Request, res: Response) {
    try {
      const { id, productId } = req.params;
      const data = updateItemSchema.parse(req.body);

      const basketItem = await prisma.basketItem.findUnique({
        where: {
          basketId_productId: {
            basketId: id,
            productId: productId,
          },
        },
      });

      if (!basketItem) {
        return res.status(404).json({
          error: 'Item not found in basket',
        });
      }

      if (data.quantity === 0) {
        // Remove item if quantity is 0
        await prisma.basketItem.delete({
          where: { id: basketItem.id },
        });

        return res.json({
          message: 'Item removed from basket',
        });
      }

      const updated = await prisma.basketItem.update({
        where: { id: basketItem.id },
        data: { quantity: data.quantity },
      });

      res.json({
        basketItem: updated,
        message: 'Item updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      console.error('Error updating basket item:', error);
      res.status(500).json({ error: 'Failed to update basket item' });
    }
  }

  /**
   * DELETE /api/baskets/:id/items/:productId
   * Remove item from basket
   */
  async removeItem(req: Request, res: Response) {
    try {
      const { id, productId } = req.params;

      const basketItem = await prisma.basketItem.findUnique({
        where: {
          basketId_productId: {
            basketId: id,
            productId: productId,
          },
        },
      });

      if (!basketItem) {
        return res.status(404).json({
          error: 'Item not found in basket',
        });
      }

      await prisma.basketItem.delete({
        where: { id: basketItem.id },
      });

      res.json({
        message: 'Item removed from basket successfully',
      });
    } catch (error) {
      console.error('Error removing basket item:', error);
      res.status(500).json({ error: 'Failed to remove basket item' });
    }
  }

  /**
   * GET /api/baskets/:id/compare
   * Compare basket prices across all stores
   */
  async compareStores(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const basket = await prisma.basket.findUnique({
        where: { id },
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
        });
      }

      // Get all stores
      const stores = await prisma.store.findMany();

      // Calculate total for each store
      const storeComparisons = stores.map(store => {
        let total = 0;
        let availableItems = 0;
        const missingProducts: string[] = [];

        basket.items.forEach(item => {
          const storeProduct = item.product.storeProducts.find(
            sp => sp.storeId === store.id && sp.priceObservations.length > 0
          );

          if (storeProduct) {
            const price = storeProduct.priceObservations[0].price;
            total += price * item.quantity;
            availableItems += item.quantity;
          } else {
            missingProducts.push(item.product.canonicalName);
          }
        });

        return {
          storeId: store.id,
          storeName: store.name,
          total,
          currency: 'BMD',
          availableItems,
          totalItems: basket.items.reduce((sum, item) => sum + item.quantity, 0),
          missingProducts,
          hasAllProducts: missingProducts.length === 0,
        };
      });

      // Find best store (has all products and lowest price)
      const storesWithAllProducts = storeComparisons.filter(s => s.hasAllProducts);
      const bestStore = storesWithAllProducts.length > 0
        ? storesWithAllProducts.reduce((best, current) =>
            current.total < best.total ? current : best
          )
        : null;

      res.json({
        basketId: id,
        itemCount: basket.items.length,
        storeComparisons,
        bestStore,
      });
    } catch (error) {
      console.error('Error comparing stores:', error);
      res.status(500).json({ error: 'Failed to compare stores' });
    }
  }
}
