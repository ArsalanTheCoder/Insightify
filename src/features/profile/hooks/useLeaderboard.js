/**
 * Insightify — useLeaderboard (Hook)
 *
 * Coordinates TanStack Query for leaderboard rankings with Daily / Monthly / All Time period filters.
 *
 * AGENTS.md & docs/RULES.md
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../services/profileApi';

export const LEADERBOARD_PERIODS = ['Daily', 'Monthly', 'All Time'];

export function useLeaderboard(initialPeriod = 'Daily') {
  const [period, setPeriod] = useState(initialPeriod);

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => getLeaderboard(period),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  const rankings = leaderboardQuery.data || [];
  const topThree = rankings.slice(0, 3);
  const remainingRankings = rankings.slice(3);

  return {
    period,
    setPeriod,
    periods: LEADERBOARD_PERIODS,
    rankings,
    topThree,
    remainingRankings,
    isLoading: leaderboardQuery.isLoading,
    isError: leaderboardQuery.isError,
  };
}
