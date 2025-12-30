import { useQuery } from '@tanstack/react-query';
import type { ApiClient } from '../api/client';

export const storeKeys = {
  all: ['stores'] as const,
  list: () => [...storeKeys.all, 'list'] as const,
  detail: (id: string) => [...storeKeys.all, 'detail', id] as const,
  products: (id: string) => [...storeKeys.all, 'products', id] as const,
};

export function useStores(apiClient: ApiClient) {
  return useQuery({
    queryKey: storeKeys.list(),
    queryFn: () => apiClient.getStores(),
  });
}

export function useStore(apiClient: ApiClient, id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => apiClient.getStore(id),
    enabled: !!id,
  });
}

export function useStoreProducts(apiClient: ApiClient, id: string) {
  return useQuery({
    queryKey: storeKeys.products(id),
    queryFn: () => apiClient.getStoreProducts(id),
    enabled: !!id,
  });
}
