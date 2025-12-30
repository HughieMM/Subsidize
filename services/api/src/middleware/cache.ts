import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
}

// In-memory cache
const cache = new Map<string, CacheEntry>();

// Cache duration in milliseconds
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Cache middleware
 * Caches GET requests for specified duration
 */
export function cacheMiddleware(durationMs: number = CACHE_DURATION) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < durationMs) {
      console.log(`Cache HIT: ${key}`);
      return res.json(cached.data);
    }

    console.log(`Cache MISS: ${key}`);

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function (data: any) {
      cache.set(key, {
        data,
        timestamp: Date.now(),
      });

      // Clean up old cache entries periodically
      if (Math.random() < 0.01) {
        // 1% chance
        cleanupCache();
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string) {
  cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Clean up expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  let deletedCount = 0;

  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} expired cache entries`);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      expired: Date.now() - entry.timestamp > CACHE_DURATION,
    })),
  };
}
