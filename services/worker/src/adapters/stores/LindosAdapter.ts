import { StubAdapter } from '../StubAdapter';

/**
 * Lindo's Family Foods Adapter
 *
 * TODO: Implement scraper for Lindo's weekly specials
 *
 * Implementation notes:
 * - Lindo's publishes weekly flyers/specials
 * - Check lindos.bm for digital flyers or PDF specials
 * - May need PDF parsing if specials are in PDF format
 * - Extract sale prices, regular prices, dates from flyer
 * - Match products to existing catalog
 *
 * Fallback: Manual entry from weekly flyers
 */
export class LindosAdapter extends StubAdapter {
  constructor() {
    super(
      {
        storeId: 'store-2',
        storeName: "Lindo's Family Foods",
        baseUrl: 'https://lindos.bm',
        rateLimit: 10,
        timeout: 15000,
      },
      'LindosAdapter',
      'Check lindos.bm for digital flyers. May require PDF parsing or manual entry.'
    );
  }

  // Future implementation:
  // - parsePDFFlyer()
  // - extractSpecialsFromHTML()
  // - matchProductsToExistingCatalog()
}
