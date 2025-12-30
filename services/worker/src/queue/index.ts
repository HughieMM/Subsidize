import { Queue, Worker, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis connection
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Job types
export interface IngestionJobData {
  storeId: string;
  storeName: string;
  type: 'full' | 'specials' | 'prices';
  productSkus?: string[]; // For targeted price updates
}

export interface IngestionJobResult {
  storeId: string;
  storeName: string;
  productsIngested: number;
  errorsEncountered: number;
  duration: number;
  timestamp: Date;
}

// Create ingestion queue
export const ingestionQueue = new Queue<IngestionJobData, IngestionJobResult>(
  'ingestion',
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: {
        age: 24 * 3600, // Keep completed jobs for 24 hours
        count: 100, // Keep max 100 completed jobs
      },
      removeOnFail: {
        age: 7 * 24 * 3600, // Keep failed jobs for 7 days
      },
    },
  }
);

// Queue events for monitoring
export const ingestionQueueEvents = new QueueEvents('ingestion', {
  connection,
});

// Helper to enqueue ingestion job
export async function enqueueIngestion(
  data: IngestionJobData
): Promise<string> {
  const job = await ingestionQueue.add(`ingest-${data.storeId}`, data, {
    jobId: `${data.storeId}-${Date.now()}`,
  });

  console.log(
    `Enqueued ingestion job ${job.id} for store ${data.storeName} (type: ${data.type})`
  );

  return job.id || '';
}

// Helper to enqueue all stores
export async function enqueueAllStores(
  type: 'full' | 'specials' = 'specials'
): Promise<string[]> {
  // TODO: Fetch stores from database
  // For now, use hardcoded store IDs
  const stores = [
    { id: 'store-1', name: 'MarketPlace' },
    { id: 'store-2', name: "Lindo's Family Foods" },
    { id: 'store-3', name: 'Supermart' },
  ];

  const jobIds: string[] = [];

  for (const store of stores) {
    const jobId = await enqueueIngestion({
      storeId: store.id,
      storeName: store.name,
      type,
    });
    jobIds.push(jobId);
  }

  return jobIds;
}

// Graceful shutdown
export async function closeQueue(): Promise<void> {
  await ingestionQueue.close();
  await ingestionQueueEvents.close();
  await connection.quit();
  console.log('Queue connections closed');
}
