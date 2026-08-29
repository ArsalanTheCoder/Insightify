/**
 * Insightify — ProtectionSummaryGrid (Component)
 *
 * 4-metric summary grid on the Home Dashboard:
 * Scans (24), Threats Blocked (7), Safe Interactions (98%), Alerts (12) + "This Week ⌵" selector.
 * Fully responsive across all device widths.
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.3
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

export default function ProtectionSummaryGrid({
  summary,
  timeframe = 'This Week',
  onTimeframePress,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();

  const metrics = [
    {
      id: 'scans',
      label: 'Scans',
      value: summary?.scansCount ?? 24,
      iconName: 'camera-outline',
      iconColor: '#0284C7',
      iconBg: isDark ? '#102038' : '#EBF5FF',
    },
    {
      id: 'blocked',
      label: 'Threats Blocked',
      value: summary?.threatsBlocked ?? 7,
      iconName: 'shield-outline',
      iconColor: '#EA580C',
      iconBg: isDark ? '#2D1E10' : '#FFF4EB',
    },
    {
      id: 'safe',
      label: 'Safe Interactions',
      value: `${summary?.safeInteractionsRate ?? 98}%`,
      iconName: 'checkmark-circle-outline',
      iconColor: '#059669',
      iconBg: isDark ? '#102C1E' : '#E8F8F0',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      value: summary?.alertsCount ?? 12,
      iconName: 'notifications-outline',
      iconColor: '#7C3AED',
      iconBg: isDark ? '#1A1528' : '#F3F0FF',
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {/* Header Row: Title + Timeframe Selector */}
      <View style={styles.headerRow}>
        <Text style={[typography.h3, styles.title, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
          Protection Summary
        </Text>
        <TouchableOpacity
          onPress={onTimeframePress}
          activeOpacity={0.7}
          style={styles.timeframeBtn}
          accessibilityRole="button"
          accessibilityLabel="Select timeframe"
        >
          <Text
            style={[
              typography.caption,
              styles.timeframeText,
              { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
            ]}
          >
            {timeframe}
          </Text>
          <Ionicons name="chevron-down" size={13} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 4 Compact, Equal-Height Metric Cards */}
      <View style={[styles.gridRow, { gap: isSmallDevice ? 5 : 7 }]}>
        {metrics.map((item) => (
          <View
            key={item.id}
            style={[
              styles.metricCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.large,
              },
            ]}
          >
            {/* Top Icon Circle */}
            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.iconName} size={15} color={item.iconColor} />
            </View>

            {/* Metric Value */}
            <Text
              numberOfLines={1}
              style={[
                typography.h3,
                styles.metricValue,
                { color: colors.textPrimary, fontSize: scaleFont(isSmallDevice ? 15 : 17, 0.3) },
              ]}
            >
              {item.value}
            </Text>

            {/* Metric Label */}
            <Text
              numberOfLines={2}
              style={[
                typography.caption,
                styles.metricLabel,
                { color: colors.textSecondary, fontSize: scaleFont(isSmallDevice ? 9.5 : 10.5, 0.3) },
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontWeight: '600',
  },
  timeframeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  timeframeText: {
    fontWeight: '500',
    marginRight: 2,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderWidth: 1,
    minHeight: 88,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  metricValue: {
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  metricLabel: {
    lineHeight: 12,
    textAlign: 'center',
  },
});
