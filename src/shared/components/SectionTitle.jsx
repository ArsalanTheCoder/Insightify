/**
 * Insightify — SectionTitle (Shared Component)
 *
 * Theme-aware section title primitive with optional action button.
 *
 * AGENTS.md section 15
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { useResponsive } from '../utils/responsive';

export default function SectionTitle({
  title,
  actionText,
  onActionPress,
  style,
}) {
  const { colors, typography, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.title, { color: colors.textPrimary, fontSize: scaleFont(17, 0.3) }]}>
        {title}
      </Text>

      {actionText ? (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.75}
          style={[styles.actionBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text style={[styles.actionText, { color: colors.primary, fontSize: scaleFont(12.5, 0.3) }]}>
            {actionText}
          </Text>
          <Ionicons name="chevron-forward" size={13} color={colors.primary} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  actionText: {
    fontWeight: '700',
  },
});
