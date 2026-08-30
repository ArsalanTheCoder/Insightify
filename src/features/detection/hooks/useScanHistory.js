/**
 * Insightify — useScanHistory (Hook)
 *
 * Coordinates TanStack Query for scan history list, telemetry statistics, and pull-to-refresh.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 10
 */

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getScanHistory } from '../services/detectionApi';

export function useScanHistory() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const historyQuery = useQuery({
    queryKey: ['detection', 'history'],
    queryFn: getScanHistory,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['detection', 'history'] });
    setIsRefreshing(false);
  }, [queryClient]);

  return {
    scans: historyQuery.data?.scans || [],
    stats: historyQuery.data?.stats || { totalScans: 0, totalThreats: 0 },
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    isRefreshing,
    handleRefresh,
  };
}
