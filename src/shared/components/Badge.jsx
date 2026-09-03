/**
 * Insightify — Badge (Shared Component)
 *
 * Small label for status, categories, or counts.
 * Theme-aware: works in Light and Dark modes.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const BADGE_VARIANTS = {
  default: 'default',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

export default function Badge({
  label,
  variant = BADGE_VARIANTS.default,
  style,
  textStyle,
}) {
  const { colors, typography, radii } = useTheme();

  const variantColors = {
    default: { bg: colors.surfaceTertiary, text: colors.primary },
    success: { bg: colors.successSoft, text: colors.success },
    warning: { bg: colors.warningSoft, text: colors.warning },
    danger: { bg: colors.dangerSoft, text: colors.danger },
    info: { bg: colors.infoSoft, text: colors.info },
  };

  const { bg, text } = variantColors[variant] || variantColors.default;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bg, borderRadius: radii.pill },
        style,
      ]}
    >
      <Text style={[typography.label, { color: text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});

Badge.variants = BADGE_VARIANTS;
