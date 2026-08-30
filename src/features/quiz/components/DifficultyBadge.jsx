/**
 * Insightify — DifficultyBadge (Quiz Component)
 *
 * Pill badge displaying quiz difficulty level (Beginner, Intermediate, Advanced).
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { getDifficultyTokens } from '../utils/quizUtils';

export default function DifficultyBadge({ difficulty = 'Beginner', suffix = '', style }) {
  const { colors, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const tokens = getDifficultyTokens(difficulty, colors);
  const label = suffix ? `${difficulty} ${suffix}` : difficulty;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tokens.bg,
          borderRadius: radii.pill || 999,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: tokens.text,
            fontSize: scaleFont(11.5, 0.3),
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
