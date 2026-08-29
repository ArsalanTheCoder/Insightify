/**
 * Insightify — Environment Configuration
 *
 * Centralized configuration for API endpoints, timeouts, and feature flags.
 *
 * docs/RULES.md section 58
 */

export const ENV = {
  /**
   * Base URL for the external FastAPI backend.
   * Configurable via environment; defaults to development placeholder.
   */
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.insightify.app',

  /**
   * Standard request timeout in milliseconds.
   */
  REQUEST_TIMEOUT_MS: 15000,

  /**
   * Analysis request timeout (longer for media/multimodal processing).
   */
  ANALYSIS_TIMEOUT_MS: 30000,
};
