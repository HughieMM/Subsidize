import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';

const router = Router();
const controller = new StoreController();

// GET /api/stores - List all stores
router.get('/', controller.list);

// GET /api/stores/:id - Get a specific store with locations
router.get('/:id', controller.getById);

// GET /api/stores/:id/products - Get products available at a store
router.get('/:id/products', controller.getProducts);

export { router as storeRoutes };
