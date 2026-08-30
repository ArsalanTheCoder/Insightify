/**
 * Insightify — quizUtils.js (Quiz Feature Utilities)
 *
 * Calculations and formatting for Quiz & Learning features.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

/**
 * Calculate score percentage (0 - 100).
 * @param {number} correct
 * @param {number} total
 * @returns {number}
 */
export function calculateScorePercent(correct, total) {
  if (!total || total <= 0) {
    return 0;
  }
  return Math.round((correct / total) * 100);
}

/**
 * Calculate XP earned for a quiz attempt.
 * @param {number} baseXp - e.g. quiz.xpReward (default 50)
 * @param {number} correct
 * @param {number} total
 * @returns {number}
 */
export function calculateXpEarned(baseXp = 50, correct = 0, total = 1) {
  if (!total || total <= 0) {
    return 0;
  }
  return Math.round(baseXp * (correct / total));
}

/**
 * Format elapsed milliseconds as mm:ss.
 * @param {number} ms
 * @returns {string} e.g. "2:45"
 */
export function formatTimeTaken(ms = 0) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Resolve difficulty badge colors and tokens.
 * @param {string} difficulty - 'Beginner' | 'Intermediate' | 'Advanced'
 * @param {object} colors - theme colors
 * @returns {{ text: string, bg: string }}
 */
export function getDifficultyTokens(difficulty, colors) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return {
        text: colors?.correct || '#20B86B',
        bg: colors?.correctSoft || '#E9F9F1',
      };
    case 'intermediate':
      return {
        text: colors?.warning || '#F59E0B',
        bg: colors?.warningSoft || '#FFF7E6',
      };
    case 'advanced':
      return {
        text: colors?.danger || '#EF4444',
        bg: colors?.dangerSoft || '#FFF0F1',
      };
    default:
      return {
        text: colors?.primary || '#245BFF',
        bg: colors?.surfaceSecondary || '#F1F5FB',
      };
  }
}
