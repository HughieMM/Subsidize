import { StubAdapter } from '../StubAdapter';

/**
 * DropIt Adapter
 *
 * TODO: Implement scraper for DropIt delivery service
 *
 * Implementation notes:
 * - DropIt is a delivery service that may aggregate from multiple stores
 * - Check if they have a public catalog or API
 * - May require app reverse-engineering or partner integration
 * - Likely has authentication requirements
 *
 * Fallback: Partner API integration only
 */
export class DropItAdapter extends StubAdapter {
  constructor() {
    super(
      {
        storeId: 'dropit-1',
        storeName: 'DropIt',
        baseUrl: 'https://dropit.bm',
        rateLimit: 10,
        timeout: 15000,
      },
      'DropItAdapter',
      'DropIt likely requires partner API integration. Check for public API documentation.'
    );
  }
}
