import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiClient } from '../api/client';

export const watchlistKeys = {
  all: ['watchlist'] as const,
  byUser: (userId: string) => [...watchlistKeys.all, 'user', userId] as const,
};

export function useWatchlist(apiClient: ApiClient, userId: string | null) {
  return useQuery({
    queryKey: watchlistKeys.byUser(userId || ''),
    queryFn: () => apiClient.getWatchlist(userId!),
    enabled: !!userId,
  });
}

export function useAddToWatchlist(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      productId,
      targetPrice,
    }: {
      userId: string;
      productId: string;
      targetPrice?: number;
    }) => apiClient.addToWatchlist(userId, productId, targetPrice),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: watchlistKeys.byUser(variables.userId),
      });
    },
  });
}

export function useRemoveFromWatchlist(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      apiClient.removeFromWatchlist(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: watchlistKeys.byUser(variables.userId),
      });
    },
  });
}

export function useUpdateWatchlistTargetPrice(apiClient: ApiClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      targetPrice,
      userId,
    }: {
      id: string;
      targetPrice: number | null;
      userId: string;
    }) => apiClient.updateWatchlistTargetPrice(id, targetPrice),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: watchlistKeys.byUser(variables.userId),
      });
    },
  });
}
