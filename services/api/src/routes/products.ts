import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { cacheMiddleware } from '../middleware/cache';

const router = Router();
const controller = new ProductController();

// Cache duration: 10 minutes
const CACHE_10_MIN = 10 * 60 * 1000;

// GET /api/products - List all products with optional filters
router.get('/', controller.list);

// GET /api/products/search - Search products (cached)
router.get('/search', cacheMiddleware(CACHE_10_MIN), controller.search);

// GET /api/products/:id - Get a specific product with prices (cached)
router.get('/:id', cacheMiddleware(CACHE_10_MIN), controller.getById);

// GET /api/products/:id/prices - Get price history for a product
router.get('/:id/prices', controller.getPriceHistory);

export { router as productRoutes };
