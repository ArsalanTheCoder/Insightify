/**
 * Insightify — Central API Client
 *
 * Unified HTTP transport layer for all backend REST API requests.
 * Handles timeouts, auth header attachment, response parsing, and error normalization.
 *
 * docs/RULES.md sections 9.1, 78
 */

import { ENV } from '../../app/config/env';

/**
 * Normalized API error shape.
 */
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Token getter placeholder — will integrate with secure session storage
 * following the Authentication RFC.
 */
let sessionTokenGetter = null;

export function setSessionTokenGetter(getter) {
  sessionTokenGetter = getter;
}

/**
 * Central fetch wrapper.
 *
 * @param {string} endpoint - Relative path (e.g. '/api/v1/...')
 * @param {object} options - Fetch options (method, body, headers, timeoutMs)
 * @returns {Promise<any>} Parsed JSON response
 */
export async function apiClient(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = ENV.REQUEST_TIMEOUT_MS,
  } = options;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${ENV.API_BASE_URL}${endpoint}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  // Attach session token if available
  if (sessionTokenGetter && typeof sessionTokenGetter === 'function') {
    const token = await sessionTokenGetter();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data?.detail || data?.message || data?.error)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection.', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error. Please check your connection.',
      0
    );
  }
}
