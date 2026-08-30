/**
 * Insightify — QuizStatRow (Quiz Component)
 *
 * Performance statistics summary card for QuizResultsScreen:
 * - Correct Answers (green dot)
 * - Wrong Answers (red dot)
 * - Skipped (neutral dot)
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function QuizStatRow({
  correctCount = 4,
  wrongCount = 1,
  skippedCount = 0,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const rows = [
    {
      label: 'Correct Answers',
      value: correctCount,
      color: colors.correct || '#20B86B',
    },
    {
      label: 'Wrong Answers',
      value: wrongCount,
      color: colors.error || '#EF4444',
    },
    {
      label: 'Skipped',
      value: skippedCount,
      color: colors.textTertiary || '#8793A7',
    },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
      ]}
    >
      {rows.map((r, index) => (
        <View
          key={r.label}
          style={[
            styles.row,
            index < rows.length - 1 && [
              styles.rowDivider,
              { borderBottomColor: colors.divider },
            ],
          ]}
        >
          <View style={styles.left}>
            <View style={[styles.dot, { backgroundColor: r.color }]} />
            <Text
              style={[
                typography.body,
                styles.label,
                { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
              ]}
            >
              {r.label}
            </Text>
          </View>
          <Text
            style={[
              typography.h3,
              styles.value,
              { color: colors.textPrimary, fontSize: scaleFont(14, 0.3) },
            ]}
          >
            {r.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    marginVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '800',
  },
});
