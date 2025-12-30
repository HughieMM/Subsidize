import { z } from 'zod';
import {
  ApiStoresResponseSchema,
  ApiProductSearchResponseSchema,
  ApiProductDetailSchema,
  ApiPriceHistoryResponseSchema,
  ApiBasketSchema,
  ApiBasketComparisonResponseSchema,
  ApiWatchlistResponseSchema,
  ApiErrorSchema,
  type ApiStoresResponse,
  type ApiProductSearchResponse,
  type ApiProductDetail,
  type ApiPriceHistoryResponse,
  type ApiBasket,
  type ApiBasketComparisonResponse,
  type ApiWatchlistResponse,
} from './types';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Try to parse as API error
        const errorResult = ApiErrorSchema.safeParse(data);
        if (errorResult.success) {
          throw new ApiClientError(
            errorResult.data.error,
            response.status,
            errorResult.data.details
          );
        }
        throw new ApiClientError(
          data.message || 'An error occurred',
          response.status
        );
      }

      // Validate response with schema if provided
      if (schema) {
        const result = schema.safeParse(data);
        if (!result.success) {
          console.error('API response validation failed:', result.error);
          throw new ApiClientError(
            'Invalid API response format',
            500,
            result.error.errors
          );
        }
        return result.data;
      }

      return data;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ApiClientError(error.message, 0);
      }
      throw new ApiClientError('Network error', 0);
    }
  }

  // Stores API
  async getStores(): Promise<ApiStoresResponse> {
    return this.fetch('/api/stores', {}, ApiStoresResponseSchema);
  }

  async getStore(id: string) {
    return this.fetch(`/api/stores/${id}`);
  }

  async getStoreProducts(id: string) {
    return this.fetch(`/api/stores/${id}/products`);
  }

  // Products API
  async searchProducts(query: string): Promise<ApiProductSearchResponse> {
    return this.fetch(
      `/api/products/search?q=${encodeURIComponent(query)}`,
      {},
      ApiProductSearchResponseSchema
    );
  }

  async getProduct(id: string): Promise<ApiProductDetail> {
    return this.fetch(`/api/products/${id}`, {}, ApiProductDetailSchema);
  }

  async getProductPriceHistory(
    id: string,
    days: number = 30
  ): Promise<ApiPriceHistoryResponse> {
    return this.fetch(
      `/api/products/${id}/prices?days=${days}`,
      {},
      ApiPriceHistoryResponseSchema
    );
  }

  // Baskets API
  async createBasket(userId?: string): Promise<ApiBasket> {
    return this.fetch(
      '/api/baskets',
      {
        method: 'POST',
        body: JSON.stringify({ userId }),
      },
      ApiBasketSchema
    );
  }

  async getBasket(id: string): Promise<ApiBasket> {
    return this.fetch(`/api/baskets/${id}`, {}, ApiBasketSchema);
  }

  async addBasketItem(
    basketId: string,
    productId: string,
    quantity: number
  ): Promise<{ basketItem: any; message: string }> {
    return this.fetch(`/api/baskets/${basketId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateBasketItem(
    basketId: string,
    productId: string,
    quantity: number
  ): Promise<{ basketItem?: any; message: string }> {
    return this.fetch(`/api/baskets/${basketId}/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeBasketItem(
    basketId: string,
    productId: string
  ): Promise<{ message: string }> {
    return this.fetch(`/api/baskets/${basketId}/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async compareBasketStores(
    basketId: string
  ): Promise<ApiBasketComparisonResponse> {
    return this.fetch(
      `/api/baskets/${basketId}/compare`,
      {},
      ApiBasketComparisonResponseSchema
    );
  }

  // Watchlist API
  async addToWatchlist(
    userId: string,
    productId: string,
    targetPrice?: number
  ): Promise<{ watchlistItem: any; message: string }> {
    return this.fetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, targetPrice }),
    });
  }

  async getWatchlist(userId: string): Promise<ApiWatchlistResponse> {
    return this.fetch(
      `/api/watchlist/user/${userId}`,
      {},
      ApiWatchlistResponseSchema
    );
  }

  async removeFromWatchlist(id: string): Promise<{ message: string }> {
    return this.fetch(`/api/watchlist/${id}`, {
      method: 'DELETE',
    });
  }

  async updateWatchlistTargetPrice(
    id: string,
    targetPrice: number | null
  ): Promise<{ watchlistItem: any; message: string }> {
    return this.fetch(`/api/watchlist/${id}/target-price`, {
      method: 'PATCH',
      body: JSON.stringify({ targetPrice }),
    });
  }
}

// Create a default instance
export const createApiClient = (baseUrl: string) => {
  return new ApiClient({ baseUrl });
};
