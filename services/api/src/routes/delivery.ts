import { Router } from 'express';
import { DeliveryController } from '../controllers/DeliveryController';

const router = Router();
const controller = new DeliveryController();

/**
 * @openapi
 * /api/delivery/orders:
 *   post:
 *     summary: Create a new delivery order
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - basketId
 *               - deliveryAddress
 *             properties:
 *               basketId:
 *                 type: string
 *               userId:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               timeWindow:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/orders', controller.createOrder);

/**
 * @openapi
 * /api/delivery/orders:
 *   get:
 *     summary: List delivery orders
 *     tags: [Delivery]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [created, accepted, shopping, delivering, complete, cancelled]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: driverId
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/orders', controller.listOrders);

/**
 * @openapi
 * /api/delivery/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id', controller.getOrder);

/**
 * @openapi
 * /api/delivery/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Delivery]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [created, accepted, shopping, delivering, complete, cancelled]
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/orders/:id/status', controller.updateStatus);

/**
 * @openapi
 * /api/delivery/orders/{id}/accept:
 *   post:
 *     summary: Accept order (for drivers)
 *     tags: [Delivery]
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
 *               - driverId
 *             properties:
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order accepted
 *       400:
 *         description: Order cannot be accepted
 */
router.post('/orders/:id/accept', controller.acceptOrder);

export { router as deliveryRoutes };
