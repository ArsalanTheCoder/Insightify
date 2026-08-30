/**
 * Insightify — useQuiz (Hook)
 *
 * Fetches metadata and questions for a specific quiz by ID.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import { useQuery } from '@tanstack/react-query';
import { getQuizById, getQuizQuestions } from '../services/quizApi';

export function useQuiz(quizId) {
  const metaQuery = useQuery({
    queryKey: ['quizMeta', quizId],
    queryFn: () => getQuizById(quizId),
    enabled: Boolean(quizId),
    staleTime: 1000 * 60 * 5,
  });

  const questionsQuery = useQuery({
    queryKey: ['quizQuestions', quizId],
    queryFn: () => getQuizQuestions(quizId),
    enabled: Boolean(quizId),
    staleTime: 1000 * 60 * 5,
  });

  return {
    quiz: metaQuery.data || null,
    questions: questionsQuery.data || [],
    isLoading: metaQuery.isLoading || questionsQuery.isLoading,
    isError: metaQuery.isError || questionsQuery.isError,
    refetch: () => {
      metaQuery.refetch();
      questionsQuery.refetch();
    },
  };
}
