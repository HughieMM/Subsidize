import { Request, Response } from 'express';
import { Queue, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { z } from 'zod';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

const ingestionQueue = new Queue('ingestion', { connection });
const ingestionQueueEvents = new QueueEvents('ingestion', { connection });

const triggerIngestionSchema = z.object({
  type: z.enum(['full', 'specials', 'prices']).default('specials'),
  storeIds: z.array(z.string()).optional(),
});

export class AdminController {
  /**
   * POST /api/admin/ingest/run
   * Trigger ingestion for all stores or specific stores
   */
  async triggerIngestion(req: Request, res: Response) {
    try {
      const data = triggerIngestionSchema.parse(req.body);

      // Determine which stores to ingest
      const storeIds = data.storeIds || ['store-1', 'store-2', 'store-3'];
      const storeNames: Record<string, string> = {
        'store-1': 'MarketPlace',
        'store-2': "Lindo's Family Foods",
        'store-3': 'Supermart',
      };

      const jobIds: string[] = [];

      for (const storeId of storeIds) {
        const job = await ingestionQueue.add(
          `ingest-${storeId}`,
          {
            storeId,
            storeName: storeNames[storeId] || storeId,
            type: data.type,
          },
          {
            jobId: `${storeId}-${Date.now()}`,
          }
        );

        jobIds.push(job.id || '');
      }

      res.status(202).json({
        message: 'Ingestion jobs enqueued',
        jobIds,
        storeCount: storeIds.length,
        type: data.type,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      console.error('Error triggering ingestion:', error);
      res.status(500).json({ error: 'Failed to trigger ingestion' });
    }
  }

  /**
   * GET /api/admin/ingest/status
   * Get status of ingestion jobs
   */
  async getIngestionStatus(req: Request, res: Response) {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        ingestionQueue.getWaiting(),
        ingestionQueue.getActive(),
        ingestionQueue.getCompleted(0, 9),
        ingestionQueue.getFailed(0, 9),
      ]);

      res.json({
        queue: 'ingestion',
        counts: {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        },
        jobs: {
          waiting: waiting.map((j) => ({
            id: j.id,
            name: j.name,
            data: j.data,
          })),
          active: active.map((j) => ({
            id: j.id,
            name: j.name,
            data: j.data,
            progress: j.progress,
          })),
          completed: completed.map((j) => ({
            id: j.id,
            name: j.name,
            returnvalue: j.returnvalue,
            finishedOn: j.finishedOn,
          })),
          failed: failed.map((j) => ({
            id: j.id,
            name: j.name,
            failedReason: j.failedReason,
            finishedOn: j.finishedOn,
          })),
        },
      });
    } catch (error) {
      console.error('Error getting ingestion status:', error);
      res.status(500).json({ error: 'Failed to get ingestion status' });
    }
  }
}
