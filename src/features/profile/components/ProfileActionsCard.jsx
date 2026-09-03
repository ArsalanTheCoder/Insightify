/**
 * Insightify — ProfileActionsCard (Component)
 *
 * Quick account actions card on Profile screen matching approved UI:
 * - Edit Profile
 * - Settings
 * - Scan History
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

export default function ProfileActionsCard({
  onEditProfile,
  onSettings,
  onScanHistory,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const actions = [
    {
      id: 'edit',
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: onEditProfile,
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'Manage app preferences',
      onPress: onSettings,
    },
    {
      id: 'history',
      icon: 'time-outline',
      title: 'Scan History',
      subtitle: 'View your past scans',
      onPress: onScanHistory,
    },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      {actions.map((item, index) => (
        <React.Fragment key={item.id}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={item.onPress}
            style={styles.actionRow}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            {/* Left Icon Circle */}
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isDark ? '#102038' : '#EEF2FF' },
              ]}
            >
              <Ionicons name={item.icon} size={20} color="#4F46E5" />
            </View>

            {/* Text Column */}
            <View style={styles.textCol}>
              <Text
                style={[
                  typography.h3,
                  styles.actionTitle,
                  { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  typography.caption,
                  styles.actionSubtitle,
                  { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
                ]}
              >
                {item.subtitle}
              </Text>
            </View>

            {/* Right Chevron */}
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>

          {index < actions.length - 1 && (
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  actionTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontWeight: '400',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
