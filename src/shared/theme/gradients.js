/**
 * Insightify — Gradient System
 *
 * The canonical CTA gradient: Blue → Purple (left → right).
 *
 * Source of truth: docs/RULES.md sections 13.2 and 21
 *
 * Usage:
 *   import { gradients } from '../theme';
 *   <LinearGradient colors={gradients.primaryCta.colors} start={gradients.primaryCta.start} end={gradients.primaryCta.end} />
 */

export const gradients = {
  /**
   * Primary CTA gradient — used for primary action buttons
   * and key highlighted surfaces.
   *
   * Direction: left → right
   * Colors: #245BFF → #A63DFF
   */
  primaryCta: {
    colors: ['#245BFF', '#A63DFF'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
};
