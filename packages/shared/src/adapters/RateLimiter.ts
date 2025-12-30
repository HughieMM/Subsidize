/**
 * Per-Domain Rate Limiter using Token Bucket Algorithm
 *
 * Ensures respectful scraping with:
 * - 1 request per 2 seconds per domain (0.5 req/sec)
 * - Maximum burst of 3 tokens
 * - Per-domain tracking
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per millisecond
}

export class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private readonly tokensPerRequest = 1;
  private readonly maxTokens = 3; // Maximum burst
  private readonly refillIntervalMs = 2000; // 2 seconds per token
  private readonly refillRate: number;

  constructor() {
    // Calculate tokens per millisecond: 1 token / 2000ms = 0.0005 tokens/ms
    this.refillRate = 1 / this.refillIntervalMs;
  }

  /**
   * Get or create bucket for domain
   */
  private getBucket(domain: string): TokenBucket {
    if (!this.buckets.has(domain)) {
      this.buckets.set(domain, {
        tokens: this.maxTokens,
        lastRefill: Date.now(),
        maxTokens: this.maxTokens,
        refillRate: this.refillRate,
      });
    }
    return this.buckets.get(domain)!;
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refillTokens(bucket: TokenBucket): void {
    const now = Date.now();
    const timeSinceLastRefill = now - bucket.lastRefill;
    const tokensToAdd = timeSinceLastRefill * bucket.refillRate;

    bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  /**
   * Attempt to consume a token for the given domain
   * Returns true if successful, false if rate limited
   */
  async tryConsume(domain: string): Promise<boolean> {
    const bucket = this.getBucket(domain);
    this.refillTokens(bucket);

    if (bucket.tokens >= this.tokensPerRequest) {
      bucket.tokens -= this.tokensPerRequest;
      return true;
    }

    return false;
  }

  /**
   * Wait until a token is available for the given domain
   * Returns the wait time in milliseconds
   */
  async waitForToken(domain: string): Promise<number> {
    const bucket = this.getBucket(domain);
    this.refillTokens(bucket);

    if (bucket.tokens >= this.tokensPerRequest) {
      bucket.tokens -= this.tokensPerRequest;
      return 0;
    }

    // Calculate wait time needed
    const tokensNeeded = this.tokensPerRequest - bucket.tokens;
    const waitTimeMs = Math.ceil(tokensNeeded / bucket.refillRate);

    // Wait for tokens to refill
    await new Promise((resolve) => setTimeout(resolve, waitTimeMs));

    // Refill and consume
    this.refillTokens(bucket);
    bucket.tokens -= this.tokensPerRequest;

    return waitTimeMs;
  }

  /**
   * Get current token count for a domain
   */
  getTokens(domain: string): number {
    const bucket = this.getBucket(domain);
    this.refillTokens(bucket);
    return bucket.tokens;
  }

  /**
   * Reset bucket for a domain (useful for testing)
   */
  reset(domain?: string): void {
    if (domain) {
      this.buckets.delete(domain);
    } else {
      this.buckets.clear();
    }
  }

  /**
   * Get statistics for all domains
   */
  getStats(): Record<string, { tokens: number; maxTokens: number }> {
    const stats: Record<string, { tokens: number; maxTokens: number }> = {};

    this.buckets.forEach((bucket, domain) => {
      this.refillTokens(bucket);
      stats[domain] = {
        tokens: Math.floor(bucket.tokens * 100) / 100, // Round to 2 decimals
        maxTokens: bucket.maxTokens,
      };
    });

    return stats;
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();
