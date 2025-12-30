import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const controller = new UserController();

// POST /api/users - Create a new user
router.post('/', controller.create);

// GET /api/users/:id - Get user profile
router.get('/:id', controller.getById);

// PUT /api/users/:id - Update user profile
router.put('/:id', controller.update);

// GET /api/users/:id/addresses - Get user addresses
router.get('/:id/addresses', controller.getAddresses);

// POST /api/users/:id/addresses - Add a new address
router.post('/:id/addresses', controller.addAddress);

export { router as userRoutes };
