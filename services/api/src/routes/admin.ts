import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';

const router = Router();
const controller = new AdminController();

/**
 * @openapi
 * /api/admin/ingest/run:
 *   post:
 *     summary: Trigger price ingestion for all stores
 *     tags: [Admin]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [full, specials, prices]
 *                 default: specials
 *               storeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       202:
 *         description: Ingestion jobs enqueued
 */
router.post('/ingest/run', controller.triggerIngestion);

/**
 * @openapi
 * /api/admin/ingest/status:
 *   get:
 *     summary: Get ingestion job status
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Job status information
 */
router.get('/ingest/status', controller.getIngestionStatus);

export { router as adminRoutes };
