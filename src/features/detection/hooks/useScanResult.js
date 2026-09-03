/**
 * Insightify — useScanResult (Hook)
 *
 * Coordinates TanStack Query for single scan result details and bookmark toggling.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 10
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getScanResultDetail, toggleResultBookmark } from '../services/detectionApi';

export function useScanResult(resultId, initialData) {
  const queryClient = useQueryClient();

  const resultQuery = useQuery({
    queryKey: ['detection', 'result', resultId],
    queryFn: () => getScanResultDetail(resultId),
    initialData,
    enabled: !!resultId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleResultBookmark(resultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detection'] });
    },
  });

  return {
    result: resultQuery.data,
    isLoading: resultQuery.isLoading,
    isError: resultQuery.isError,
    toggleBookmark: () => bookmarkMutation.mutate(),
  };
}
