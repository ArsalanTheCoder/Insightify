/**
 * Insightify — Canonical Color System
 *
 * All semantic colors for the application. Both Light Mode and Dark Mode
 * use the same token names with mode-specific values.
 *
 * Source of truth: docs/RULES.md sections 13–15
 *
 * Usage:
 *   import { useTheme } from '../hooks/useTheme';
 *   const { colors } = useTheme();
 *   <View style={{ backgroundColor: colors.background }} />
 */

// ─────────────────────────────────────────────
// Brand colors (mode-independent)
// ─────────────────────────────────────────────
export const brand = {
  primary: '#245BFF',
  primaryDark: '#1748D1',
  deepNavy: '#071A49',
  teal: '#12B8B0',
  tealDark: '#0A8F8A',
  lightBlue: '#EAF4FF',
  softPurple: '#F2EEFF',
  purple: '#8B3DFF',
};

// ─────────────────────────────────────────────
// Semantic status colors (mode-independent)
// ─────────────────────────────────────────────
export const semantic = {
  success: '#20B86B',
  successSoft: '#E9F9F1',
  warning: '#F59E0B',
  warningSoft: '#FFF7E6',
  danger: '#EF4444',
  dangerSoft: '#FFF0F1',
  info: '#3B82F6',
  infoSoft: '#EDF5FF',
  // Semantic aliases for Quiz and Learning
  correct: '#20B86B',
  correctSoft: '#E9F9F1',
  error: '#EF4444',
  errorSoft: '#FFF0F1',
  xp: '#F59E0B',
  xpSoft: '#FFF7E6',
};

// ─────────────────────────────────────────────
// Light Mode surface/text/border tokens
// docs/RULES.md section 14
// ─────────────────────────────────────────────
export const light = {
  // Brand
  ...brand,

  // Semantic
  ...semantic,

  // Surfaces
  background: '#F8FAFF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5FB',
  surfaceTertiary: '#EAF4FF',

  // Text
  textPrimary: '#071A49',
  textSecondary: '#5B6B84',
  textTertiary: '#8793A7',
  textOnBrand: '#FFFFFF',

  // Borders & Dividers
  border: '#DDE6F2',
  divider: '#E7EDF5',

  // Overlay
  overlay: 'rgba(7, 26, 73, 0.45)',
};

// ─────────────────────────────────────────────
// Dark Mode surface/text/border tokens
// docs/RULES.md section 15
// ─────────────────────────────────────────────
export const dark = {
  // Brand
  ...brand,

  // Semantic
  ...semantic,

  // Surfaces
  background: '#061329',
  surface: '#0D1D36',
  surfaceSecondary: '#122743',
  surfaceTertiary: '#173253',

  // Text
  textPrimary: '#F5F9FF',
  textSecondary: '#B8C7DB',
  textTertiary: '#7F90A7',
  textOnBrand: '#FFFFFF',

  // Borders & Dividers
  border: '#213652',
  divider: '#1A2D47',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.60)',
};
