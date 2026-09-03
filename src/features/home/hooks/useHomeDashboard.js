/**
 * Insightify — useHomeDashboard (Hook)
 *
 * Coordinates server-state queries for the Home Dashboard using TanStack Query:
 * - Protection summary metrics
 * - Live threat feed preview
 * - Daily safety tip
 * - Unread notifications count
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 9
 */

import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getHomeSummary,
  getThreatFeedPreview,
  getDailySafetyTip,
  getUnreadNotificationsCount,
} from '../services/homeApi';

export function useHomeDashboard() {
  const queryClient = useQueryClient();
  const [timeframe, setTimeframe] = useState('this_week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Protection Summary Query
  const summaryQuery = useQuery({
    queryKey: ['home', 'summary', timeframe],
    queryFn: () => getHomeSummary(timeframe),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // 2. Threat Feed Preview Query
  const feedQuery = useQuery({
    queryKey: ['home', 'threat-feed-preview'],
    queryFn: () => getThreatFeedPreview(2),
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // 3. Daily Safety Tip Query
  const tipQuery = useQuery({
    queryKey: ['home', 'daily-tip'],
    queryFn: getDailySafetyTip,
    staleTime: 1000 * 60 * 60, // 60 minutes
  });

  // 4. Notifications Count Query
  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadNotificationsCount,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['home'] }),
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    ]);
    setIsRefreshing(false);
  }, [queryClient]);

  return {
    // Data
    summary: summaryQuery.data,
    threatFeed: feedQuery.data || [],
    dailyTip: tipQuery.data,
    unreadNotifications: notificationsQuery.data?.unreadCount || 0,

    // Loading & Refreshing States
    isLoading: summaryQuery.isLoading || feedQuery.isLoading,
    isRefreshing,
    handleRefresh,

    // Timeframe filter
    timeframe,
    setTimeframe,

    // Errors
    isError: summaryQuery.isError || feedQuery.isError,
    refetchSummary: summaryQuery.refetch,
    refetchFeed: feedQuery.refetch,
  };
}
