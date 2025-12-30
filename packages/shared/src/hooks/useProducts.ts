import { useQuery } from '@tanstack/react-query';
import type { ApiClient } from '../api/client';

export const productKeys = {
  all: ['products'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  priceHistory: (id: string, days: number) =>
    [...productKeys.all, 'priceHistory', id, days] as const,
};

export function useProductSearch(apiClient: ApiClient, query: string) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => apiClient.searchProducts(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(apiClient: ApiClient, id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
  });
}

export function useProductPriceHistory(
  apiClient: ApiClient,
  id: string,
  days: number = 30
) {
  return useQuery({
    queryKey: productKeys.priceHistory(id, days),
    queryFn: () => apiClient.getProductPriceHistory(id, days),
    enabled: !!id,
  });
}
