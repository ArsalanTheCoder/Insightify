/**
 * Insightify — Card (Shared Component)
 *
 * A themed surface container with optional shadow.
 * Theme-aware: works in Light and Dark modes.
 *
 * docs/RULES.md section 24
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function Card({
  children,
  elevated = false,
  style,
  ...rest
}) {
  const { colors, radii, shadows } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.card,
          borderColor: colors.border,
        },
        elevated ? shadows.card : styles.bordered,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
  },
});
