import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const controller = new ProductController();

// GET /api/products - List all products with optional filters
router.get('/', controller.list);

// GET /api/products/search - Search products
router.get('/search', controller.search);

// GET /api/products/:id - Get a specific product with prices
router.get('/:id', controller.getById);

// GET /api/products/:id/prices - Get price history for a product
router.get('/:id/prices', controller.getPriceHistory);

export { router as productRoutes };
