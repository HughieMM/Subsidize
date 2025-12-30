import { Router } from 'express';
import { WatchlistController } from '../controllers/WatchlistController';

const router = Router();
const controller = new WatchlistController();

/**
 * @openapi
 * /api/watchlist:
 *   post:
 *     summary: Add product to watchlist
 *     tags: [Watchlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               targetPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added to watchlist
 */
router.post('/', controller.add);

/**
 * @openapi
 * /api/watchlist/user/{userId}:
 *   get:
 *     summary: Get user's watchlist
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Watchlist retrieved successfully
 */
router.get('/user/:userId', controller.getByUser);

/**
 * @openapi
 * /api/watchlist/{id}:
 *   delete:
 *     summary: Remove product from watchlist
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from watchlist
 */
router.delete('/:id', controller.remove);

/**
 * @openapi
 * /api/watchlist/{id}/target-price:
 *   patch:
 *     summary: Update target price for watchlist item
 *     tags: [Watchlist]
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
 *               - targetPrice
 *             properties:
 *               targetPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Target price updated
 */
router.patch('/:id/target-price', controller.updateTargetPrice);

export { router as watchlistRouter };
