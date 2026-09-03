/**
 * Insightify — Typography System
 *
 * Centralized type scale using the Inter font family.
 *
 * Source of truth: docs/RULES.md section 17
 *
 * Usage:
 *   import { typography } from '../theme';
 *   <Text style={typography.h1}>Title</Text>
 */

const FONT_FAMILY = 'Inter';

export const typography = {
  display: {
    fontFamily: FONT_FAMILY,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
  },
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  button: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
};
