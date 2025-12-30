import {
  StoreAdapter,
  StoreAdapterConfig,
  ProductData,
  WeeklySpecial,
  AdapterMetrics,
  AdapterError,
} from './types';

/**
 * Base implementation of StoreAdapter
 * Provides common functionality for all adapters
 */
export abstract class BaseAdapter implements StoreAdapter {
  protected metrics: AdapterMetrics | null = null;
  protected lastRequestTime: number = 0;

  constructor(public readonly config: StoreAdapterConfig) {}

  abstract get name(): string;

  /**
   * Enforce rate limiting
   * @param minInterval Minimum time between requests in ms
   */
  protected async rateLimit(minInterval?: number): Promise<void> {
    const interval =
      minInterval || (this.config.rateLimit ? 60000 / this.config.rateLimit : 0);

    if (interval > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < interval) {
        const waitTime = interval - timeSinceLastRequest;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      this.lastRequestTime = Date.now();
    }
  }

  /**
   * Execute a function with timeout
   */
  protected async withTimeout<T>(
    fn: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    const timeoutMs = timeout || this.config.timeout || 30000;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([fn(), timeoutPromise]);
  }

  /**
   * Update metrics after a run
   */
  protected updateMetrics(
    productsFound: number,
    errors: number,
    duration: number,
    errorMessages?: string[]
  ): void {
    this.metrics = {
      timestamp: new Date(),
      productsFound,
      errors,
      duration,
      errorMessages,
    };
  }

  /**
   * Fetch with retry logic
   */
  protected async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        await this.rateLimit();

        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; SubsidizeBot/1.0; +https://subsidize.bm)',
            ...this.config.headers,
            ...options.headers,
          },
        });

        if (response.ok) {
          return response;
        }

        // Handle specific status codes
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          console.warn(
            `Rate limited by ${this.name}, waiting ${waitTime}ms`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        if (response.status >= 500) {
          // Server error, retry
          lastError = new Error(`Server error: ${response.status}`);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (i + 1))
          );
          continue;
        }

        // Client error, don't retry
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, i))
          );
        }
      }
    }

    throw new AdapterError(
      `Failed after ${retries} retries: ${lastError?.message}`,
      this.name,
      lastError || undefined
    );
  }

  abstract listProducts(options?: {
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<ProductData[]>;

  abstract searchProducts(
    query: string,
    options?: { limit?: number }
  ): Promise<ProductData[]>;

  abstract fetchWeeklySpecials(): Promise<WeeklySpecial[]>;

  abstract fetchPricesFor(identifiers: string[]): Promise<ProductData[]>;

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.config.baseUrl) {
        return false;
      }
      const response = await fetch(this.config.baseUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  getMetrics(): AdapterMetrics | null {
    return this.metrics;
  }
}
