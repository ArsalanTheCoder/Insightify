/**
 * Insightify — Theme System
 *
 * Central barrel export for the complete design system.
 * Assembles Light and Dark themes from individual token modules.
 *
 * Usage:
 *   import { lightTheme, darkTheme } from '../theme';
 *   // or through the useTheme hook (preferred):
 *   import { useTheme } from '../hooks/useTheme';
 */

import { light, dark } from './colors';
import { typography } from './typography';
import { spacing, screenPaddingHorizontal } from './spacing';
import { radii } from './radii';
import { lightShadows, darkShadows } from './shadows';
import { gradients } from './gradients';

export const lightTheme = {
  dark: false,
  colors: light,
  typography,
  spacing,
  screenPaddingHorizontal,
  radii,
  shadows: lightShadows,
  gradients,
};

export const darkTheme = {
  dark: true,
  colors: dark,
  typography,
  spacing,
  screenPaddingHorizontal,
  radii,
  shadows: darkShadows,
  gradients,
};

// Re-export individual modules for granular access
export { brand, semantic } from './colors';
export { typography } from './typography';
export { spacing, screenPaddingHorizontal } from './spacing';
export { radii } from './radii';
export { gradients } from './gradients';
