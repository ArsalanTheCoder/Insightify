/**
 * Insightify — useQuizDashboard (Hook)
 *
 * Coordinates data for QuizDashboardScreen:
 * - User Profile (Level, Title, XP)
 * - Categories
 * - Daily Challenge
 * - Stats and In-Progress Quiz from useQuizProgressStore
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import { useQuery } from '@tanstack/react-query';
import { useProfile } from '../../profile/hooks/useProfile';
import { useQuizProgressStore } from '../store/useQuizProgressStore';
import { getQuizCategories, getDailyChallenge } from '../services/quizApi';

export function useQuizDashboard() {
  const { profile } = useProfile();

  const {
    streak,
    quizzesPlayed,
    avgScore,
    inProgressQuiz,
  } = useQuizProgressStore();

  const categoriesQuery = useQuery({
    queryKey: ['quizCategories'],
    queryFn: getQuizCategories,
    staleTime: 1000 * 60 * 5,
  });

  const dailyChallengeQuery = useQuery({
    queryKey: ['dailyChallenge'],
    queryFn: getDailyChallenge,
    staleTime: 1000 * 60 * 5,
  });

  return {
    userLevel: profile?.level || 6,
    userTitle: profile?.title || 'AI Awareness Champion',
    userXp: profile?.xp || 820,
    nextXp: profile?.nextXp || 1000,
    streak,
    quizzesPlayed,
    avgScore,
    inProgressQuiz,
    categories: categoriesQuery.data || [],
    dailyChallenge: dailyChallengeQuery.data || null,
    isLoading: categoriesQuery.isLoading || dailyChallengeQuery.isLoading,
  };
}
