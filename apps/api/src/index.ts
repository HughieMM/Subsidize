import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'subsidize-api' });
});

// API routes
app.get('/api/v1/stores', (req, res) => {
  res.json({
    stores: [
      { id: '1', name: 'MarketPlace', location: 'Hamilton' },
      { id: '2', name: 'Lindo\'s', location: 'Warwick' },
      { id: '3', name: 'The Supermart', location: 'Paget' },
    ],
  });
});

app.get('/api/v1/products', (req, res) => {
  res.json({
    products: [
      {
        id: '1',
        name: 'Milk (1L)',
        category: 'Dairy',
        prices: [
          { storeId: '1', price: 3.99 },
          { storeId: '2', price: 4.29 },
          { storeId: '3', price: 3.89 },
        ],
      },
      {
        id: '2',
        name: 'Bread (White)',
        category: 'Bakery',
        prices: [
          { storeId: '1', price: 2.99 },
          { storeId: '2', price: 3.19 },
          { storeId: '3', price: 2.89 },
        ],
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
