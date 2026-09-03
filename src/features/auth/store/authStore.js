/**
 * Insightify — Auth Store
 *
 * Manages client-side authentication status and active user state using Zustand.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 8.1
 */

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  sessionToken: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setSessionToken: (sessionToken) => set({ sessionToken }),

  setLoading: (isLoading) => set({ isLoading }),

  login: (userData, sessionToken = null) =>
    set({
      user: userData,
      isAuthenticated: true,
      sessionToken,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      sessionToken: null,
      isLoading: false,
    }),
}));
