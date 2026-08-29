/**
 * Insightify — Shadow / Elevation System
 *
 * Subtle, consistent shadows for both Light and Dark modes.
 *
 * Source of truth: docs/RULES.md section 20
 *
 * Usage:
 *   import { useTheme } from '../hooks/useTheme';
 *   const { shadows } = useTheme();
 *   <View style={shadows.card} />
 */

import { Platform } from 'react-native';

export const lightShadows = {
  /** No shadow */
  none: {},

  /** Subtle card shadow */
  card: Platform.select({
    ios: {
      shadowColor: '#071A49',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
  }),

  /** Medium elevation — modals, floating actions */
  medium: Platform.select({
    ios: {
      shadowColor: '#071A49',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
  }),

  /** High elevation — overlays, important elevated cards */
  high: Platform.select({
    ios: {
      shadowColor: '#071A49',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
    },
    android: {
      elevation: 8,
    },
  }),
};

export const darkShadows = {
  /** No shadow */
  none: {},

  /** Subtle card shadow — darker base */
  card: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
  }),

  /** Medium elevation */
  medium: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
  }),

  /** High elevation */
  high: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
    },
    android: {
      elevation: 8,
    },
  }),
};
