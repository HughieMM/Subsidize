import {
  BaseAdapter,
  ProductData,
  WeeklySpecial,
  StoreAdapterConfig,
} from '@subsidize/shared';

/**
 * Stub Adapter
 *
 * A safe stub implementation that returns empty results.
 * Used for stores where real adapters are not yet implemented.
 *
 * This adapter will NOT break the worker - it gracefully returns
 * empty data and logs TODO messages.
 */
export class StubAdapter extends BaseAdapter {
  constructor(
    config: StoreAdapterConfig,
    private readonly adapterName: string,
    private readonly todoMessage?: string
  ) {
    super(config);
  }

  get name(): string {
    return this.adapterName;
  }

  private logTodo(method: string): void {
    console.log(
      `TODO [${this.name}]: ${method} not implemented. ${
        this.todoMessage || 'Implement real adapter when ready.'
      }`
    );
  }

  async listProducts(): Promise<ProductData[]> {
    this.logTodo('listProducts');
    const startTime = Date.now();

    // Simulate some work
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.updateMetrics(0, 0, Date.now() - startTime);
    return [];
  }

  async searchProducts(query: string): Promise<ProductData[]> {
    this.logTodo(`searchProducts("${query}")`);
    const startTime = Date.now();

    await new Promise((resolve) => setTimeout(resolve, 100));

    this.updateMetrics(0, 0, Date.now() - startTime);
    return [];
  }

  async fetchWeeklySpecials(): Promise<WeeklySpecial[]> {
    this.logTodo('fetchWeeklySpecials');
    const startTime = Date.now();

    await new Promise((resolve) => setTimeout(resolve, 100));

    this.updateMetrics(0, 0, Date.now() - startTime);
    return [];
  }

  async fetchPricesFor(identifiers: string[]): Promise<ProductData[]> {
    this.logTodo(`fetchPricesFor(${identifiers.length} products)`);
    const startTime = Date.now();

    await new Promise((resolve) => setTimeout(resolve, 100));

    this.updateMetrics(0, 0, Date.now() - startTime);
    return [];
  }

  async healthCheck(): Promise<boolean> {
    // Stub adapters are always "healthy" - they just don't do anything
    return true;
  }
}
