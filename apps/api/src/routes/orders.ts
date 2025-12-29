import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const controller = new OrderController();

// POST /api/orders - Create a new order
router.post('/', controller.create);

// GET /api/orders/:id - Get order details
router.get('/:id', controller.getById);

// GET /api/orders/user/:userId - Get orders for a user
router.get('/user/:userId', controller.getByUserId);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', controller.updateStatus);

export { router as orderRoutes };
