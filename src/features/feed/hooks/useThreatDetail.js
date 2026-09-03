/**
 * Insightify — useThreatDetail (Hook)
 *
 * Coordinates TanStack Query for loading a single security incident detail report and bookmark state.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 12
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getThreatDetail, toggleThreatBookmark } from '../services/feedApi';

export function useThreatDetail(threatId) {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ['feed', 'detail', threatId],
    queryFn: () => getThreatDetail(threatId),
    enabled: !!threatId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleThreatBookmark(threatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    threat: detailQuery.data,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    refetch: detailQuery.refetch,
    toggleBookmark: () => bookmarkMutation.mutate(),
    isBookmarking: bookmarkMutation.isPending,
  };
}
