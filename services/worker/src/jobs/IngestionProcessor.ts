import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { IngestionJobData, IngestionJobResult } from '../queue';
import { adapterRegistry } from '../adapters/AdapterRegistry';
import { ProductData, WeeklySpecial } from '@subsidize/shared';

const prisma = new PrismaClient();

/**
 * Process ingestion job
 * Fetches data from store adapter and persists to database
 */
export async function processIngestion(
  job: Job<IngestionJobData>
): Promise<IngestionJobResult> {
  const { storeId, storeName, type, productSkus } = job.data;
  const startTime = Date.now();

  console.log(
    `Processing ingestion for ${storeName} (type: ${type}, job: ${job.id})`
  );

  // Update job progress
  await job.updateProgress(10);

  // Get adapter for store
  const adapter = adapterRegistry.get(storeId);
  if (!adapter) {
    throw new Error(`No adapter found for store ${storeId}`);
  }

  let productsIngested = 0;
  let errorsEncountered = 0;

  try {
    await job.updateProgress(20);

    // Fetch data based on job type
    let products: ProductData[] = [];
    let specials: WeeklySpecial[] = [];

    switch (type) {
      case 'full':
        console.log(`Fetching full product catalog for ${storeName}...`);
        products = await adapter.listProducts({ limit: 1000 });
        break;

      case 'specials':
        console.log(`Fetching weekly specials for ${storeName}...`);
        specials = await adapter.fetchWeeklySpecials();
        // Convert specials to products
        products = specials.map((s) => ({
          sku: s.sku,
          name: s.name,
          price: s.salePrice,
          isOnSale: true,
          salePrice: s.salePrice,
          sourceUrl: s.sourceUrl,
          currency: 'BMD',
        }));
        break;

      case 'prices':
        console.log(
          `Fetching prices for ${productSkus?.length || 0} products...`
        );
        if (productSkus && productSkus.length > 0) {
          products = await adapter.fetchPricesFor(productSkus);
        }
        break;
    }

    await job.updateProgress(50);

    // Persist to database
    if (products.length > 0) {
      productsIngested = await persistProducts(storeId, products);
    }

    await job.updateProgress(90);

    console.log(
      `Ingestion complete for ${storeName}: ${productsIngested} products ingested`
    );
  } catch (error) {
    console.error(`Error during ingestion for ${storeName}:`, error);
    errorsEncountered++;

    // Log error to database
    await logIngestionError(storeId, error as Error);
  }

  await job.updateProgress(100);

  const duration = Date.now() - startTime;

  // Log run
  await logIngestionRun(storeId, productsIngested, errorsEncountered, duration);

  return {
    storeId,
    storeName,
    productsIngested,
    errorsEncountered,
    duration,
    timestamp: new Date(),
  };
}

/**
 * Persist products to database
 */
async function persistProducts(
  storeId: string,
  products: ProductData[]
): Promise<number> {
  let count = 0;

  for (const product of products) {
    try {
      // Find or create canonical product
      let canonicalProduct = await prisma.product.findFirst({
        where: {
          OR: [
            // Match by GTIN if available
            product.gtin ? { gtin: product.gtin } : undefined,
            // Match by normalized name
            {
              canonicalName: {
                equals: normalizeProductName(product.name),
                mode: 'insensitive',
              },
            },
          ].filter(Boolean) as any,
        },
      });

      if (!canonicalProduct) {
        // Create new product
        canonicalProduct = await prisma.product.create({
          data: {
            canonicalName: normalizeProductName(product.name),
            brand: product.brand,
            sizeValue: product.sizeValue,
            sizeUnit: product.sizeUnit,
            gtin: product.gtin,
          },
        });
      }

      // Create or update store product
      const storeProduct = await prisma.storeProduct.upsert({
        where: {
          storeId_storeSku: {
            storeId: storeId,
            storeSku: product.sku,
          },
        },
        create: {
          storeId,
          productId: canonicalProduct.id,
          storeSku: product.sku,
          rawName: product.name,
          rawSize: product.size,
          sourceUrl: product.sourceUrl,
        },
        update: {
          rawName: product.name,
          rawSize: product.size,
          sourceUrl: product.sourceUrl,
          productId: canonicalProduct.id,
        },
      });

      // Create price observation
      await prisma.priceObservation.create({
        data: {
          storeProductId: storeProduct.id,
          price: product.price,
          currency: product.currency || 'BMD',
          unitPrice: product.unitPrice,
          unitPriceUnit: product.unitPriceUnit,
          sourceType: 'scrape',
          observedAt: new Date(),
        },
      });

      count++;
    } catch (error) {
      console.error(`Error persisting product ${product.sku}:`, error);
    }
  }

  return count;
}

/**
 * Normalize product name for matching
 */
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Log ingestion run to database
 */
async function logIngestionRun(
  storeId: string,
  productsIngested: number,
  errors: number,
  duration: number
): Promise<void> {
  // TODO: Create IngestionRun model in Prisma schema for tracking
  console.log(`Ingestion run logged: ${storeId} - ${productsIngested} products, ${errors} errors, ${duration}ms`);
}

/**
 * Log ingestion error to database
 */
async function logIngestionError(storeId: string, error: Error): Promise<void> {
  // TODO: Create IngestionError model in Prisma schema
  console.error(`Ingestion error for ${storeId}:`, error.message);
}
