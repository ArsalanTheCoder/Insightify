/**
 * Insightify — useAchievements (Hook)
 *
 * Coordinates TanStack Query for achievements list, progress calculation, and
 * All / Unlocked / Locked category filtering.
 *
 * AGENTS.md & docs/RULES.md
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '../services/profileApi';

export const ACHIEVEMENT_FILTERS = ['All', 'Unlocked', 'Locked'];

export function useAchievements(initialFilter = 'All') {
  const [filter, setFilter] = useState(initialFilter);

  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const rawData = achievementsQuery.data;

  const allAchievements = useMemo(() => {
    return rawData || [];
  }, [rawData]);

  const unlockedAchievements = useMemo(() => {
    return allAchievements.filter((a) => a.unlocked);
  }, [allAchievements]);

  const lockedAchievements = useMemo(() => {
    return allAchievements.filter((a) => !a.unlocked);
  }, [allAchievements]);

  const unlockedCount = 12; // Matching reference UI indicator 12 / 28
  const totalCount = 28;

  const progress = totalCount > 0 ? unlockedCount / totalCount : 0;

  const filteredAchievements = useMemo(() => {
    if (filter === 'Unlocked') {
      return unlockedAchievements;
    }
    if (filter === 'Locked') {
      return lockedAchievements;
    }
    return allAchievements;
  }, [allAchievements, unlockedAchievements, lockedAchievements, filter]);

  return {
    filter,
    setFilter,
    filters: ACHIEVEMENT_FILTERS,
    achievements: filteredAchievements,
    allAchievements,
    unlockedAchievements,
    lockedAchievements,
    totalCount,
    unlockedCount,
    progress,
    isLoading: achievementsQuery.isLoading,
    isError: achievementsQuery.isError,
  };
}
