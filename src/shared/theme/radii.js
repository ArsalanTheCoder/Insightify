/**
 * Insightify — Border Radius System
 *
 * Source of truth: docs/RULES.md section 19
 *
 * Usage:
 *   import { radii } from '../theme';
 *   <View style={{ borderRadius: radii.card }} />
 */

export const radii = {
  /** 8px — Small chips, tags */
  small: 8,
  /** 12px — Inputs, secondary elements */
  medium: 12,
  /** 16px — Buttons, cards */
  large: 16,
  /** 20px — Prominent cards, sheets */
  xlarge: 20,
  /** 18px — Standard card radius */
  card: 18,
  /** 999px — Fully rounded pills */
  pill: 999,
};
