# Subsidize Ingestion Worker

Background worker service for ingesting grocery price data from various stores in Bermuda.

## Overview

The worker uses **BullMQ** for job processing and **Redis** for queue management. It implements a plugin-based adapter system where each store has its own adapter for fetching pricing data.

## Architecture

```
services/worker/
├── src/
│   ├── adapters/
│   │   ├── AdapterRegistry.ts      # Central registry for all adapters
│   │   ├── StubAdapter.ts          # Safe stub for unimplemented adapters
│   │   └── stores/                  # Store-specific adapters
│   │       ├── MarketPlaceAdapter.ts
│   │       ├── LindosAdapter.ts
│   │       ├── MilesAdapter.ts
│   │       ├── DropItAdapter.ts
│   │       └── SupermartAdapter.ts
│   ├── jobs/
│   │   └── IngestionProcessor.ts   # Job processing logic
│   ├── queue/
│   │   └── index.ts                # Queue setup and helpers
│   └── index.ts                     # Worker entry point
```

## Store Adapters

### Adapter Interface

All adapters implement the `StoreAdapter` interface from `@subsidize/shared`:

```typescript
interface StoreAdapter {
  listProducts(options?: { limit?: number; category?: string }): Promise<ProductData[]>;
  searchProducts(query: string): Promise<ProductData[]>;
  fetchWeeklySpecials(): Promise<WeeklySpecial[]>;
  fetchPricesFor(identifiers: string[]): Promise<ProductData[]>;
  healthCheck(): Promise<boolean>;
  getMetrics(): AdapterMetrics | null;
}
```

### Currently Implemented Adapters

All adapters are currently **safe stubs** that return empty results and log TODO messages. They will not break the worker.

1. **MarketPlaceAdapter** (`store-1`)
   - TODO: Implement scraper for marketplace.bm
   - May require partner API integration

2. **LindosAdapter** (`store-2`)
   - TODO: Parse weekly flyers/specials from lindos.bm
   - May involve PDF parsing

3. **MilesAdapter** (`miles-1`)
   - TODO: Investigate Miles Market catalog
   - May require authentication or partner API

4. **DropItAdapter** (`dropit-1`)
   - TODO: Partner API integration
   - Likely requires authentication

5. **SupermartAdapter** (`store-3`)
   - Manual pricing only
   - No automated scraping planned

### Implementing Real Adapters

To implement a real adapter:

1. Extend `BaseAdapter` (provides rate limiting, retries, timeout handling)
2. Override the required methods
3. Handle errors gracefully (don't break the worker)
4. Respect `robots.txt` and rate limits
5. Use the `fetchWithRetry` helper for HTTP requests

**Example**:

```typescript
import { BaseAdapter, ProductData } from '@subsidize/shared';

export class MyStoreAdapter extends BaseAdapter {
  get name() {
    return 'MyStoreAdapter';
  }

  async fetchWeeklySpecials(): Promise<WeeklySpecial[]> {
    const startTime = Date.now();

    try {
      // Fetch data
      const response = await this.fetchWithRetry('https://store.com/specials');
      const html = await response.text();

      // Parse data
      const specials = this.parseSpecials(html);

      // Update metrics
      this.updateMetrics(specials.length, 0, Date.now() - startTime);

      return specials;
    } catch (error) {
      this.updateMetrics(0, 1, Date.now() - startTime, [error.message]);
      throw error;
    }
  }

  // ... implement other methods
}
```

## Job Types

### 1. Full Catalog Ingestion (`full`)

Fetches all products from a store's catalog.

```json
{
  "storeId": "store-1",
  "storeName": "MarketPlace",
  "type": "full"
}
```

### 2. Weekly Specials (`specials`)

Fetches only sale/special prices.

```json
{
  "storeId": "store-2",
  "storeName": "Lindo's",
  "type": "specials"
}
```

### 3. Targeted Price Updates (`prices`)

Updates prices for specific products.

```json
{
  "storeId": "store-1",
  "storeName": "MarketPlace",
  "type": "prices",
  "productSkus": ["SKU123", "SKU456"]
}
```

## Running the Worker

### Prerequisites

- Redis running on `localhost:6379` (or set `REDIS_URL`)
- PostgreSQL database (shares connection with API)
- Prisma schema generated

### Development

```bash
# From services/worker directory
pnpm dev

# Or from repository root
pnpm --filter worker dev
```

### Production

```bash
pnpm build
pnpm start
```

### Environment Variables

```env
# Redis connection
REDIS_URL=redis://localhost:6379

# Database (uses Prisma from API)
DATABASE_URL=postgresql://user:password@localhost:5432/subsidize

# Worker settings
WORKER_CONCURRENCY=2
RATE_LIMIT_PER_MINUTE=10
```

## Triggering Ingestion

### Via API Endpoint

```bash
# Trigger weekly specials ingestion for all stores
curl -X POST http://localhost:3001/api/admin/ingest/run \
  -H "Content-Type: application/json" \
  -d '{"type": "specials"}'

# Trigger for specific stores
curl -X POST http://localhost:3001/api/admin/ingest/run \
  -H "Content-Type: application/json" \
  -d '{
    "type": "full",
    "storeIds": ["store-1", "store-2"]
  }'
```

### Via Code

```typescript
import { enqueueIngestion, enqueueAllStores } from './queue';

// Enqueue single store
await enqueueIngestion({
  storeId: 'store-1',
  storeName: 'MarketPlace',
  type: 'specials',
});

// Enqueue all stores
await enqueueAllStores('specials');
```

## Monitoring

### Check Queue Status

```bash
curl http://localhost:3001/api/admin/ingest/status
```

Response:

```json
{
  "queue": "ingestion",
  "counts": {
    "waiting": 2,
    "active": 1,
    "completed": 5,
    "failed": 0
  },
  "jobs": {
    "waiting": [...],
    "active": [...],
    "completed": [...],
    "failed": [...]
  }
}
```

### Worker Logs

The worker logs:

- Adapter registration on startup
- Health check results
- Job start/completion
- Product ingestion counts
- Errors and retry attempts

## Features

### Built-in Resilience

- **Rate Limiting**: Configurable per adapter (default: 10 req/min)
- **Retries**: Exponential backoff (3 attempts)
- **Timeouts**: Configurable per request
- **Circuit Breaking**: Failed jobs moved to failed queue
- **Graceful Degradation**: Stub adapters won't break the system

### Data Persistence

Products are normalized and linked:

1. Create/find canonical `Product`
2. Create/update `StoreProduct` with raw data
3. Create `PriceObservation` with timestamp

This allows:
- Price history tracking
- Cross-store product matching
- Trend analysis

### Job Retention

- Completed jobs: kept for 24 hours
- Failed jobs: kept for 7 days
- Automatic cleanup

## Development Workflow

### Adding a New Store

1. Create adapter file in `src/adapters/stores/`
2. Implement `StoreAdapter` interface
3. Register in `src/index.ts`
4. Add store to database (via seed or API)
5. Test with `POST /api/admin/ingest/run`

### Testing an Adapter

```typescript
import { MyAdapter } from './adapters/stores/MyAdapter';

const adapter = new MyAdapter();

// Health check
const healthy = await adapter.healthCheck();

// Fetch specials
const specials = await adapter.fetchWeeklySpecials();
console.log(specials);

// Check metrics
const metrics = adapter.getMetrics();
console.log(metrics);
```

## TODO: Future Enhancements

- [ ] Implement real scrapers for MarketPlace, Lindo's
- [ ] Partner API integrations for Miles, DropIt
- [ ] Scheduled cron jobs for automatic ingestion
- [ ] Dead letter queue for persistent failures
- [ ] Ingestion run history in database
- [ ] Alert system for failed jobs
- [ ] Dashboard for monitoring (Bull Board)
- [ ] Product matching improvements (ML/fuzzy matching)
- [ ] Image scraping for product photos
- [ ] Category extraction and normalization

## Troubleshooting

### Worker not processing jobs

- Check Redis is running: `redis-cli ping`
- Check queue has jobs: `curl localhost:3001/api/admin/ingest/status`
- Check worker logs for errors

### Jobs failing immediately

- Check adapter health: logs show health check results on startup
- Check database connection
- Check network access to store websites

### Rate limiting errors

- Increase rate limit in adapter config
- Reduce worker concurrency
- Check store's `robots.txt` for crawl delay

## License

Private - Subsidize Platform
