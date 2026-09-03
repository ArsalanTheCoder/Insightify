/**
 * Insightify — SettingToggleRow (Component)
 *
 * Switch toggle row on SettingsScreen.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function SettingToggleRow({
  icon,
  title,
  value,
  onToggle,
  style,
}) {
  const { colors, typography, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  return (
    <View style={[styles.row, style]}>
      <View style={styles.leftCol}>
        <View style={[styles.iconCircle, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}>
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={[typography.body, styles.title, { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) }]}>
          {title}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: isDark ? '#1E293B' : '#E2E8F0', true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
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
