/**
 * Insightify — useTheme Hook
 *
 * Provides the active theme (Light or Dark) to any component.
 * Uses Zustand for theme preference persistence.
 *
 * Usage:
 *   import { useTheme } from '../../shared/hooks/useTheme';
 *
 *   function MyComponent() {
 *     const { colors, typography, spacing, radii, shadows, gradients, isDark, toggleTheme } = useTheme();
 *     return <View style={{ backgroundColor: colors.background }} />;
 *   }
 */

import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

/**
 * Zustand store for theme preference.
 * 'system' follows the OS setting; 'light'/'dark' override it.
 */
export const useThemeStore = create((set) => ({
  /** 'system' | 'light' | 'dark' */
  preference: 'system',

  setPreference: (preference) => set({ preference }),
}));

/**
 * Hook to access the resolved Insightify theme.
 *
 * Returns the full theme object plus convenience helpers:
 *   - isDark: boolean
 *   - toggleTheme: switches between light and dark overrides
 *   - setThemePreference: sets 'system', 'light', or 'dark'
 */
export function useTheme() {
  const systemScheme = useColorScheme();
  const { preference, setPreference } = useThemeStore();

  const isDark =
    preference === 'system'
      ? systemScheme === 'dark'
      : preference === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setPreference(isDark ? 'light' : 'dark');
  };

  return {
    ...theme,
    isDark,
    toggleTheme,
    setThemePreference: setPreference,
  };
}
