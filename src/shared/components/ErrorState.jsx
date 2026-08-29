/**
 * Insightify — ErrorState (Shared Component)
 *
 * User-friendly error screen/card with retry capability.
 *
 * docs/RULES.md section 42
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
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
      accessibilityRole="alert"
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.dangerSoft },
        ]}
      >
        <Ionicons name="alert-circle" size={40} color={colors.danger} />
      </View>
      <Text style={[typography.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            typography.body,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.xs,
              maxWidth: 300,
            },
          ]}
        >
          {message}
        </Text>
      ) : null}
      {onRetry && (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="secondary"
          style={[styles.retryButton, { marginTop: spacing.lg }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  retryButton: {
    minWidth: 160,
  },
});
