import { StoreAdapter } from '@subsidize/shared';

/**
 * Adapter Registry
 *
 * Manages store adapters and provides a central registry for all adapters.
 */
export class AdapterRegistry {
  private adapters: Map<string, StoreAdapter> = new Map();

  /**
   * Register an adapter for a store
   */
  register(storeId: string, adapter: StoreAdapter): void {
    this.adapters.set(storeId, adapter);
    console.log(`Registered adapter for store: ${storeId} (${adapter.name})`);
  }

  /**
   * Get adapter for a store
   */
  get(storeId: string): StoreAdapter | undefined {
    return this.adapters.get(storeId);
  }

  /**
   * Check if adapter exists for store
   */
  has(storeId: string): boolean {
    return this.adapters.has(storeId);
  }

  /**
   * Get all registered adapters
   */
  getAll(): StoreAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Get all store IDs
   */
  getStoreIds(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Health check all adapters
   */
  async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [storeId, adapter] of this.adapters) {
      try {
        results[storeId] = await adapter.healthCheck();
      } catch (error) {
        console.error(`Health check failed for ${storeId}:`, error);
        results[storeId] = false;
      }
    }

    return results;
  }
}

// Singleton instance
export const adapterRegistry = new AdapterRegistry();
