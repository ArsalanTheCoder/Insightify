/**
 * Insightify — quizApi.js (Quiz Service Layer)
 *
 * Mock service layer providing quiz data and operations.
 * Structured for clean replacement when FastAPI backend is integrated.
 *
 * Operations defined in RFC-005-F Section 9:
 * - Fetch quiz list
 * - Fetch quiz details
 * - Fetch quiz questions
 * - Submit quiz attempt
 * - Fetch attempt results
 * - Fetch answer review
 * - Fetch daily challenge
 * - Fetch user quiz progress
 * - Fetch quiz leaderboard
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import {
  MOCK_QUIZ_LIST,
  MOCK_QUIZ_CATEGORIES,
  MOCK_DAILY_CHALLENGE,
} from '../data/mockQuizData';

/**
 * Fetch list of all quizzes with optional difficulty or category filter.
 * @param {{ difficulty?: string, category?: string }} filter
 * @returns {Promise<Array>}
 */
export async function getQuizList(filter = {}) {
  // Simulate minimal latency for realism
  await new Promise((resolve) => setTimeout(resolve, 80));

  let results = [...MOCK_QUIZ_LIST];

  if (filter.difficulty && filter.difficulty !== 'All') {
    results = results.filter(
      (q) => q.difficulty.toLowerCase() === filter.difficulty.toLowerCase()
    );
  }

  if (filter.category && filter.category !== 'All') {
    results = results.filter(
      (q) => q.category.toLowerCase() === filter.category.toLowerCase()
    );
  }

  return results;
}

/**
 * Fetch metadata for a specific quiz by ID.
 * @param {string} quizId
 * @returns {Promise<object>}
 */
export async function getQuizById(quizId) {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const found = MOCK_QUIZ_LIST.find((q) => q.id === quizId);
  if (!found) {
    throw new Error(`Quiz with id "${quizId}" not found`);
  }
  return { ...found };
}

/**
 * Fetch questions array for a specific quiz by ID.
 * @param {string} quizId
 * @returns {Promise<Array>}
 */
export async function getQuizQuestions(quizId) {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const found = MOCK_QUIZ_LIST.find((q) => q.id === quizId);
  if (!found) {
    throw new Error(`Quiz with id "${quizId}" not found`);
  }
  return found.questions || [];
}

/**
 * Fetch daily challenge metadata.
 * @returns {Promise<object>}
 */
export async function getDailyChallenge() {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return { ...MOCK_DAILY_CHALLENGE };
}

/**
 * Fetch quiz categories with counts.
 * @returns {Promise<Array>}
 */
export async function getQuizCategories() {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...MOCK_QUIZ_CATEGORIES];
}

/**
 * Submit quiz attempt (local mock for now).
 * @param {{ quizId: string, answers: Array, timeTakenMs: number }} payload
 * @returns {Promise<object>}
 */
export async function submitQuizAttempt(payload) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    attemptId: `att_${Date.now()}`,
    status: 'success',
    submittedAt: new Date().toISOString(),
    ...payload,
  };
}
