/**
 * Insightify — QuizProgressDots (Quiz Component)
 *
 * Horizontal progress indicator with connected dots for Question Screen.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function QuizProgressDots({
  total = 5,
  currentIndex = 0,
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Background connector line */}
      <View
        style={[
          styles.connectorLine,
          { backgroundColor: colors.border },
        ]}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          let dotBg = colors.border;
          let dotBorder = colors.border;
          let dotSize = 10;

          if (isCompleted) {
            dotBg = colors.primary;
            dotBorder = colors.primary;
          } else if (isCurrent) {
            dotBg = colors.primary;
            dotBorder = colors.primary;
            dotSize = 12;
          }

          return (
            <View
              key={`dot_${index}`}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: dotBg,
                  borderColor: dotBorder,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginVertical: 8,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    height: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '88%',
  },
  dot: {
    borderWidth: 1.5,
  },
});
