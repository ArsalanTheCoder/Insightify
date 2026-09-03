/**
 * Insightify — Onboarding Store
 *
 * Manages first-time onboarding visibility state using Zustand + AsyncStorage persistence.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 8.1
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY = '@insightify_has_seen_onboarding';

export const useOnboardingStore = create((set) => ({
  hasSeenOnboarding: null,
  isLoading: true,

  checkOnboardingStatus: async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      set({ hasSeenOnboarding: value === 'true', isLoading: false });
    } catch {
      set({ hasSeenOnboarding: false, isLoading: false });
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      set({ hasSeenOnboarding: true });
    } catch (e) {
      set({ hasSeenOnboarding: true });
    }
  },

  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      set({ hasSeenOnboarding: false });
    } catch (e) {
      set({ hasSeenOnboarding: false });
    }
  },
}));
