/**
 * Insightify — useQuizList (Hook)
 *
 * Fetches and filters the list of all quizzes.
 * Uses TanStack Query for caching and lifecycle.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuizList } from '../services/quizApi';

export function useQuizList(initialDifficulty = 'All') {
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);

  const query = useQuery({
    queryKey: ['quizList', selectedDifficulty],
    queryFn: () => getQuizList({ difficulty: selectedDifficulty }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    quizzes: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    selectedDifficulty,
    setSelectedDifficulty,
    difficulties: ['All', 'Beginner', 'Intermediate', 'Advanced'],
  };
}
