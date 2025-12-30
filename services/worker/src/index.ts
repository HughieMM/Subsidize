import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import { adapterRegistry } from './adapters/AdapterRegistry';
import {
  MarketPlaceAdapter,
  LindosAdapter,
  MilesAdapter,
  DropItAdapter,
  SupermartAdapter,
} from './adapters/stores';
import { processIngestion } from './jobs/IngestionProcessor';
import { IngestionJobData, IngestionJobResult } from './queue';

// Load environment variables
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Register all store adapters
function registerAdapters() {
  console.log('Registering store adapters...');

  // MarketPlace
  const marketPlaceAdapter = new MarketPlaceAdapter();
  adapterRegistry.register('store-1', marketPlaceAdapter);

  // Lindo's
  const lindosAdapter = new LindosAdapter();
  adapterRegistry.register('store-2', lindosAdapter);

  // Supermart
  const supermartAdapter = new SupermartAdapter();
  adapterRegistry.register('store-3', supermartAdapter);

  // Miles (not in seed data, but registered for future)
  const milesAdapter = new MilesAdapter();
  adapterRegistry.register('miles-1', milesAdapter);

  // DropIt (not in seed data, but registered for future)
  const dropItAdapter = new DropItAdapter();
  adapterRegistry.register('dropit-1', dropItAdapter);

  console.log(`Registered ${adapterRegistry.getStoreIds().length} adapters`);
}

// Create worker
function createWorker() {
  const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  const worker = new Worker<IngestionJobData, IngestionJobResult>(
    'ingestion',
    async (job) => {
      return await processIngestion(job);
    },
    {
      connection,
      concurrency: 2, // Process 2 jobs at a time
      limiter: {
        max: 10, // Max 10 jobs
        duration: 60000, // Per minute
      },
    }
  );

  // Worker event handlers
  worker.on('completed', (job, result) => {
    console.log(
      `Job ${job.id} completed: ${result.productsIngested} products ingested for ${result.storeName}`
    );
  });

  worker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  return worker;
}

// Main
async function main() {
  console.log('🚀 Starting Subsidize Ingestion Worker...');

  // Register adapters
  registerAdapters();

  // Health check adapters
  console.log('\n🏥 Checking adapter health...');
  const healthResults = await adapterRegistry.healthCheckAll();
  Object.entries(healthResults).forEach(([storeId, healthy]) => {
    const status = healthy ? '✅' : '❌';
    console.log(`  ${status} ${storeId}: ${healthy ? 'healthy' : 'unhealthy'}`);
  });

  // Create and start worker
  console.log('\n⚙️  Starting job processor...');
  const worker = createWorker();

  console.log('\n✨ Worker ready! Waiting for jobs...');
  console.log('   Queue: ingestion');
  console.log('   Concurrency: 2');
  console.log('   Rate limit: 10 jobs/minute\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down worker...');
    await worker.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n👋 Shutting down worker...');
    await worker.close();
    process.exit(0);
  });
}

// Start
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
