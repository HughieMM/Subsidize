import { StubAdapter } from '../StubAdapter';

/**
 * Miles Market Adapter
 *
 * TODO: Implement scraper for Miles Market
 *
 * Implementation notes:
 * - Miles is a premium grocery store in Bermuda
 * - Check for online shopping/catalog availability
 * - May have authentication requirements for pricing
 * - If auth wall exists, consider partner API or manual entry
 *
 * Fallback: Partner integration or manual price surveys
 */
export class MilesAdapter extends StubAdapter {
  constructor() {
    super(
      {
        storeId: 'miles-1',
        storeName: 'Miles Market',
        baseUrl: 'https://miles.bm',
        rateLimit: 10,
        timeout: 15000,
      },
      'MilesAdapter',
      'Investigate miles.bm catalog. May require authentication or partner API.'
    );
  }
}
