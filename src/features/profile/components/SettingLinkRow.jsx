/**
 * Insightify — SettingLinkRow (Component)
 *
 * Navigation link row on SettingsScreen.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function SettingLinkRow({
  icon,
  title,
  onPress,
  style,
}) {
  const { colors, typography, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.row, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.leftCol}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}>
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={[typography.body, styles.title, { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) }]}>
          {title}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontWeight: '600',
  },
});
