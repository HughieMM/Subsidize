import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { PrismaClient } from '@prisma/client';
import { productRoutes } from './routes/products';
import { storeRoutes } from './routes/stores';
import { userRoutes } from './routes/users';
import { orderRoutes } from './routes/orders';
import { basketsRouter } from './routes/baskets';
import { watchlistRouter } from './routes/watchlist';
import { adminRoutes } from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger/OpenAPI setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subsidize API',
      version: '1.0.0',
      description: 'Grocery price comparison and delivery API for Bermuda',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/baskets', basketsRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
