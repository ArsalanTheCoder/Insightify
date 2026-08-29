/**
 * Insightify — LoadingState (Shared Component)
 *
 * Full-screen or container loading state with spinner and optional message.
 *
 * docs/RULES.md section 40
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function LoadingState({
  message = 'Loading...',
  fullScreen = false,
  style,
}) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && [styles.fullScreen, { backgroundColor: colors.background }],
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginTop: spacing.md },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});
