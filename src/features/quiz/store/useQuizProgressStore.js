/**
 * Insightify — useQuizProgressStore.js (Zustand Store)
 *
 * Client-owned state for Quiz progress, streaks, and in-progress quiz session.
 * Not a server cache.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import { create } from 'zustand';

export const useQuizProgressStore = create((set) => ({
  streak: 3,
  quizzesPlayed: 12,
  avgScore: 85,
  inProgressQuiz: {
    quizId: 'phishing-basics',
    title: 'Phishing Basics',
    questionCount: 5,
    questionIndex: 0,
    lastPlayed: 'Yesterday',
  },
  completedQuizIds: ['phishing-basics'],
  quizScores: {
    'phishing-basics': 85,
    'fake-websites': 70,
    'scam-messages': 90,
    'privacy-protection': 75,
    'malware-awareness': 60,
  },

  setInProgressQuiz: (inProgressQuiz) => set({ inProgressQuiz }),

  clearInProgressQuiz: () => set({ inProgressQuiz: null }),

  recordQuizCompletion: ({ quizId, score, earnedXp: _earnedXp }) =>
    set((state) => {
      const isNewCompletion = !state.completedQuizIds.includes(quizId);
      const newCompleted = isNewCompletion
        ? [...state.completedQuizIds, quizId]
        : state.completedQuizIds;

      const newScores = {
        ...state.quizScores,
        [quizId]: score,
      };

      const scoreValues = Object.values(newScores);
      const calculatedAvg = Math.round(
        scoreValues.reduce((sum, val) => sum + val, 0) / scoreValues.length
      );

      return {
        quizzesPlayed: state.quizzesPlayed + 1,
        completedQuizIds: newCompleted,
        quizScores: newScores,
        avgScore: calculatedAvg,
        inProgressQuiz: null,
      };
    }),

  incrementStreak: () =>
    set((state) => ({ streak: state.streak + 1 })),
}));
