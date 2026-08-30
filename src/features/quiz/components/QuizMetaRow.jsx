/**
 * Insightify — QuizMetaRow (Quiz Component)
 *
 * 3-column metadata card for QuizStartScreen:
 * - Questions count
 * - Duration (e.g. "5 min")
 * - XP Reward (e.g. "50 XP")
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function QuizMetaRow({
  questions = 5,
  durationMinutes = 5,
  xpReward = 50,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const items = [
    { value: `${questions}`, label: 'Questions' },
    { value: `${durationMinutes} min`, label: 'Duration' },
    { value: `${xpReward} XP`, label: 'Reward' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSecondary,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
      ]}
    >
      {items.map((item, index) => (
        <View
          key={item.label}
          style={[
            styles.col,
            index < items.length - 1 && [
              styles.colBorder,
              { borderRightColor: colors.border },
            ],
          ]}
        >
          <Text
            style={[
              typography.h3,
              styles.val,
              { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
            ]}
          >
            {item.value}
          </Text>
          <Text
            style={[
              typography.caption,
              styles.lbl,
              { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    marginVertical: 16,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colBorder: {
    borderRightWidth: 1,
  },
  val: {
    fontWeight: '800',
    marginBottom: 2,
  },
  lbl: {
    fontWeight: '500',
  },
});
