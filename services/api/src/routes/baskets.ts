import { Router } from 'express';
import { BasketController } from '../controllers/BasketController';

const router = Router();
const controller = new BasketController();

/**
 * @openapi
 * /api/baskets:
 *   post:
 *     summary: Create a new basket
 *     tags: [Baskets]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Basket created successfully
 */
router.post('/', controller.create);

/**
 * @openapi
 * /api/baskets/{id}:
 *   get:
 *     summary: Get basket by ID
 *     tags: [Baskets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Basket retrieved successfully
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /api/baskets/{id}/items:
 *   post:
 *     summary: Add item to basket
 *     tags: [Baskets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to basket
 */
router.post('/:id/items', controller.addItem);

/**
 * @openapi
 * /api/baskets/{id}/items/{productId}:
 *   patch:
 *     summary: Update item quantity in basket
 *     tags: [Baskets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
router.patch('/:id/items/:productId', controller.updateItem);

/**
 * @openapi
 * /api/baskets/{id}/items/{productId}:
 *   delete:
 *     summary: Remove item from basket
 *     tags: [Baskets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 */
router.delete('/:id/items/:productId', controller.removeItem);

/**
 * @openapi
 * /api/baskets/{id}/compare:
 *   get:
 *     summary: Compare basket prices across all stores
 *     tags: [Baskets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price comparison retrieved
 */
router.get('/:id/compare', controller.compareStores);

export { router as basketsRouter };
