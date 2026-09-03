/**
 * Insightify — ProgressBar (Shared Component)
 *
 * Theme-aware progress bar primitive.
 *
 * AGENTS.md section 15
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function ProgressBar({
  progress = 0,
  height = 8,
  fillColor,
  trackColor,
  style,
}) {
  const { colors, isDark } = useTheme();

  const clampedProgress = Math.max(0, Math.min(1, progress || 0));
  const bgTrack = trackColor || (isDark ? '#1E293B' : '#EEF4FF');
  const bgFill = fillColor || colors.primary;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: bgTrack,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${Math.round(clampedProgress * 100)}%`,
            borderRadius: height / 2,
            backgroundColor: bgFill,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
