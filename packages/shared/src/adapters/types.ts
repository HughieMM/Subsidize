/**
 * Store Adapter Interface
 *
 * Defines the contract for store-specific data ingestion adapters.
 * Each adapter is responsible for fetching product and pricing data
 * from a specific grocery store.
 */

export interface ProductData {
  /** Store-specific SKU or identifier */
  sku: string;
  /** Product name as it appears in the store */
  name: string;
  /** Product brand (if available) */
  brand?: string;
  /** Size string (e.g., "1 lb", "500ml") */
  size?: string;
  /** Parsed size value */
  sizeValue?: number;
  /** Parsed size unit (e.g., "lb", "ml", "oz") */
  sizeUnit?: string;
  /** Current price */
  price: number;
  /** Currency code (default: "BMD") */
  currency?: string;
  /** Unit price (e.g., price per lb) */
  unitPrice?: number;
  /** Unit price unit */
  unitPriceUnit?: string;
  /** Source URL where product was found */
  sourceUrl?: string;
  /** GTIN/barcode if available */
  gtin?: string;
  /** Whether product is on sale */
  isOnSale?: boolean;
  /** Sale price if on sale */
  salePrice?: number;
  /** Category or department */
  category?: string;
}

export interface WeeklySpecial {
  /** Product SKU */
  sku: string;
  /** Product name */
  name: string;
  /** Regular price */
  regularPrice: number;
  /** Sale price */
  salePrice: number;
  /** Sale start date */
  saleStartDate?: Date;
  /** Sale end date */
  saleEndDate?: Date;
  /** Source URL */
  sourceUrl?: string;
}

export interface AdapterMetrics {
  /** Timestamp of the ingestion run */
  timestamp: Date;
  /** Number of products successfully fetched */
  productsFound: number;
  /** Number of errors encountered */
  errors: number;
  /** Duration in milliseconds */
  duration: number;
  /** Any error messages */
  errorMessages?: string[];
}

export interface StoreAdapterConfig {
  /** Store identifier (matches Store.id in database) */
  storeId: string;
  /** Store name */
  storeName: string;
  /** Base URL for the store's website */
  baseUrl?: string;
  /** API key if required */
  apiKey?: string;
  /** Rate limit (requests per minute) */
  rateLimit?: number;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Custom headers for requests */
  headers?: Record<string, string>;
}

/**
 * StoreAdapter Interface
 *
 * All store adapters must implement this interface.
 * Adapters should be resilient and handle failures gracefully.
 */
export interface StoreAdapter {
  /** Adapter configuration */
  readonly config: StoreAdapterConfig;

  /** Adapter name/identifier */
  readonly name: string;

  /**
   * List all available products from the store
   * @param options Optional parameters for pagination, filtering, etc.
   * @returns Array of product data
   */
  listProducts(options?: {
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<ProductData[]>;

  /**
   * Search for products by query
   * @param query Search query string
   * @param options Optional parameters
   * @returns Array of matching products
   */
  searchProducts(
    query: string,
    options?: { limit?: number }
  ): Promise<ProductData[]>;

  /**
   * Fetch weekly specials/sales
   * @returns Array of products on sale
   */
  fetchWeeklySpecials(): Promise<WeeklySpecial[]>;

  /**
   * Fetch prices for specific products
   * @param identifiers Product SKUs, URLs, or other identifiers
   * @returns Array of product data with current prices
   */
  fetchPricesFor(identifiers: string[]): Promise<ProductData[]>;

  /**
   * Check if the adapter is available/healthy
   * @returns true if adapter can connect to store, false otherwise
   */
  healthCheck(): Promise<boolean>;

  /**
   * Get metrics from the last run
   * @returns Adapter metrics
   */
  getMetrics(): AdapterMetrics | null;
}

/**
 * Base error class for adapter-related errors
 */
export class AdapterError extends Error {
  constructor(
    message: string,
    public readonly adapterName: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AdapterError';
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends AdapterError {
  constructor(adapterName: string, retryAfter?: number) {
    super(
      `Rate limit exceeded for ${adapterName}${
        retryAfter ? `, retry after ${retryAfter}ms` : ''
      }`,
      adapterName
    );
    this.name = 'RateLimitError';
  }
}

/**
 * Error thrown when adapter times out
 */
export class TimeoutError extends AdapterError {
  constructor(adapterName: string, timeout: number) {
    super(
      `Adapter ${adapterName} timed out after ${timeout}ms`,
      adapterName
    );
    this.name = 'TimeoutError';
  }
}
