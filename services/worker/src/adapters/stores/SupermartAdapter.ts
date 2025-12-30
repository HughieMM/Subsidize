import { StubAdapter } from '../StubAdapter';

/**
 * Supermart Adapter
 *
 * TODO: Manual pricing only - no automated ingestion planned
 *
 * Implementation notes:
 * - Supermart may not have online presence
 * - Pricing may need to be manually surveyed
 * - Consider in-person price surveys or partner relationships
 *
 * Fallback: Manual data entry from periodic store visits
 */
export class SupermartAdapter extends StubAdapter {
  constructor() {
    super(
      {
        storeId: 'store-3',
        storeName: 'Supermart',
        rateLimit: 0, // No automated requests
        timeout: 0,
      },
      'SupermartAdapter',
      'Manual pricing only. No automated scraping planned. Use manual data entry workflow.'
    );
  }
}
