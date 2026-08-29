/**
 * Insightify — EmptyState (Shared Component)
 *
 * Friendly, informative empty state for lists, feeds, and detail screens.
 *
 * docs/RULES.md section 41
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';

export default function EmptyState({
  icon = 'file-tray-outline',
  title = 'No items found',
  description,
  actionTitle,
  onAction,
  style,
}) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <Ionicons name={icon} size={36} color={colors.textTertiary} />
      </View>
      <Text style={[typography.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
        {title}
      </Text>
      {description && (
        <Text
          style={[
            typography.body,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.xs,
              maxWidth: 280,
            },
          ]}
        >
          {description}
        </Text>
      )}
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="secondary"
          style={[styles.actionButton, { marginTop: spacing.lg }]}
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
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionButton: {
    minWidth: 160,
  },
});
