/**
 * Insightify — Spacing System
 *
 * 4-point-based spacing scale for consistent rhythm.
 *
 * Source of truth: docs/RULES.md section 18
 *
 * Usage:
 *   import { spacing } from '../theme';
 *   <View style={{ padding: spacing.md }} />
 */

export const spacing = {
  /** 4px */
  xxs: 4,
  /** 8px */
  xs: 8,
  /** 12px */
  sm: 12,
  /** 16px */
  md: 16,
  /** 20px */
  lg: 20,
  /** 24px */
  xl: 24,
  /** 32px */
  xxl: 32,
  /** 40px */
  xxxl: 40,
  /** 48px */
  huge: 48,
  /** 56px */
  massive: 56,
  /** 64px */
  giant: 64,
};

/**
 * Default horizontal screen padding.
 * docs/RULES.md section 18.1: 20–24 px
 */
export const screenPaddingHorizontal = 20;
