/**
 * Insightify — SectionHeader (Shared Component)
 *
 * Section titles with optional action/link on the right.
 *
 * docs/RULES.md section 17.1, 18.2
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.sm }, style]}>
      <Text style={[typography.h3, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[typography.label, { color: colors.primary }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
