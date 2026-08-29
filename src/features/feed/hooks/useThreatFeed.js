/**
 * Insightify — useThreatFeed (Hook)
 *
 * Coordinates TanStack Query for feed discovery, tabs, category filters, and bookmark toggling.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 12
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getThreatFeed, toggleThreatBookmark } from '../services/feedApi';

export function useThreatFeed() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('for_you'); // 'for_you' | 'trending' | 'nearby' | 'latest'
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Feed Query
  const feedQuery = useQuery({
    queryKey: ['feed', 'list', activeTab, activeCategory],
    queryFn: () => getThreatFeed({ tab: activeTab, category: activeCategory }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Bookmark Mutation
  const bookmarkMutation = useMutation({
    mutationFn: (threatId) => toggleThreatBookmark(threatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  // Pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['feed'] });
    setIsRefreshing(false);
  }, [queryClient]);

  const handleToggleBookmark = (threatId) => {
    bookmarkMutation.mutate(threatId);
  };

  return {
    threats: feedQuery.data || [],
    isLoading: feedQuery.isLoading,
    isError: feedQuery.isError,
    isRefreshing,
    handleRefresh,

    // Tabs
    activeTab,
    setActiveTab,

    // Category Filter
    activeCategory,
    setActiveCategory,
    isFilterModalVisible,
    setFilterModalVisible,

    // Bookmark
    handleToggleBookmark,
  };
}
