import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '../api/client';

export const basketKeys = {
  all: ['baskets'] as const,
  detail: (id: string) => [...basketKeys.all, 'detail', id] as const,
  comparison: (id: string) => [...basketKeys.all, 'comparison', id] as const,
};

export function useBasket(apiClient: ApiClient, basketId: string | null) {
  return useQuery({
    queryKey: basketKeys.detail(basketId || ''),
    queryFn: () => apiClient.getBasket(basketId!),
    enabled: !!basketId,
  });
}

export function useBasketComparison(
  apiClient: ApiClient,
  basketId: string | null
) {
  return useQuery({
    queryKey: basketKeys.comparison(basketId || ''),
    queryFn: () => apiClient.compareBasketStores(basketId!),
    enabled: !!basketId,
  });
}

export function useCreateBasket(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId?: string) => apiClient.createBasket(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basketKeys.all });
    },
  });
}

export function useAddBasketItem(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      basketId,
      productId,
      quantity,
    }: {
      basketId: string;
      productId: string;
      quantity: number;
    }) => apiClient.addBasketItem(basketId, productId, quantity),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: basketKeys.detail(variables.basketId),
      });
      queryClient.invalidateQueries({
        queryKey: basketKeys.comparison(variables.basketId),
      });
    },
  });
}

export function useUpdateBasketItem(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      basketId,
      productId,
      quantity,
    }: {
      basketId: string;
      productId: string;
      quantity: number;
    }) => apiClient.updateBasketItem(basketId, productId, quantity),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: basketKeys.detail(variables.basketId),
      });
      queryClient.invalidateQueries({
        queryKey: basketKeys.comparison(variables.basketId),
      });
    },
  });
}

export function useRemoveBasketItem(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      basketId,
      productId,
    }: {
      basketId: string;
      productId: string;
    }) => apiClient.removeBasketItem(basketId, productId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: basketKeys.detail(variables.basketId),
      });
      queryClient.invalidateQueries({
        queryKey: basketKeys.comparison(variables.basketId),
      });
    },
  });
}
