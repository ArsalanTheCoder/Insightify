/**
 * Insightify — QuizResultDonut (Quiz Component)
 *
 * Multi-color segmented donut chart representing:
 * - Correct Answers (colors.correct)
 * - Wrong Answers (colors.error)
 * - Skipped Answers (colors.textTertiary / neutral)
 *
 * Renders high-precision segmented SVG arcs proportional to actual counts.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function QuizResultDonut({
  correctCount = 4,
  wrongCount = 1,
  skippedCount = 0,
  totalQuestions = 5,
  scorePercent = 80,
  feedbackText = 'Great Job!',
}) {
  const { colors, typography } = useTheme();
  const { scaleFont, moderateScale } = useResponsive();

  const size = moderateScale(154);
  const strokeWidth = moderateScale(12);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = Math.max(
    1,
    (correctCount || 0) + (wrongCount || 0) + (skippedCount || 0) || totalQuestions || 5
  );

  const correctLength = (correctCount / total) * circumference;
  const wrongLength = (wrongCount / total) * circumference;
  const skippedLength = (skippedCount / total) * circumference;

  const correctColor = colors.correct || '#20B86B';
  const wrongColor = colors.error || '#EF4444';
  const skippedColor = colors.textTertiary || '#8793A7';
  const trackColor = colors.surfaceSecondary || '#F1F5FB';

  // Dynamic feedback if not explicitly passed
  let resolvedFeedback = feedbackText;
  if (!feedbackText || feedbackText === 'Great Job!') {
    if (scorePercent >= 80) {
      resolvedFeedback = 'Great Job!';
    } else if (scorePercent >= 60) {
      resolvedFeedback = 'Well Done!';
    } else {
      resolvedFeedback = 'Keep Learning!';
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrap, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Base Track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Rotate so 0 degrees starts at top (12 o'clock) */}
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* 1. Correct Segment */}
            {correctCount > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={correctColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${correctLength} ${circumference - correctLength}`}
                strokeDashoffset={0}
              />
            )}

            {/* 2. Wrong Segment */}
            {wrongCount > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={wrongColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${wrongLength} ${circumference - wrongLength}`}
                strokeDashoffset={-correctLength}
              />
            )}

            {/* 3. Skipped Segment */}
            {skippedCount > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={skippedColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${skippedLength} ${circumference - skippedLength}`}
                strokeDashoffset={-(correctLength + wrongLength)}
              />
            )}
          </G>
        </Svg>

        {/* Center score percentage and feedback label */}
        <View style={styles.innerContent}>
          <Text
            style={[
              typography.h1,
              styles.scoreNumber,
              { color: colors.textPrimary, fontSize: scaleFont(30, 0.4) },
            ]}
          >
            {scorePercent}%
          </Text>
          <Text
            style={[
              typography.caption,
              styles.feedbackLabel,
              { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
            ]}
          >
            {resolvedFeedback}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  chartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  feedbackLabel: {
    fontWeight: '600',
    marginTop: 2,
  },
});
