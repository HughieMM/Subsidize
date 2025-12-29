import { Worker, Queue } from 'bullmq';
import dotenv from 'dotenv';
import { scrapePricesJob } from './jobs/scrapePrices';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Create queues
const priceScrapingQueue = new Queue('price-scraping', { connection });

// Create workers
const priceWorker = new Worker('price-scraping', scrapePricesJob, {
  connection,
  concurrency: 5,
});

// Worker event handlers
priceWorker.on('completed', job => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

priceWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

priceWorker.on('error', err => {
  console.error('Worker error:', err);
});

console.log('🔄 Background worker started');
console.log('📊 Listening for jobs on queue: price-scraping');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await priceWorker.close();
  process.exit(0);
});

export { priceScrapingQueue };
