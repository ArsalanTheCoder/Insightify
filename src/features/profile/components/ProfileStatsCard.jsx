/**
 * Insightify — ProfileStatsCard (Component)
 *
 * 3-Column Security & Progress statistics card:
 * Scans | Threats Prevented | Reports
 *
 * Note: Global Rank is NOT shown here — it belongs in the Leaderboard context.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ProfileStatsCard({
  scans = 47,
  threatsPrevented = 19,
  reports = 8,
  style,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const stats = [
    { value: `${scans}`, label: 'Scans', color: '#4F46E5' },
    { value: `${threatsPrevented}`, label: 'Threats Prevented', color: '#EF4444' },
    { value: `${reports}`, label: 'Reports', color: '#F59E0B' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      {stats.map((item, index) => (
        <View
          key={item.label}
          style={[
            styles.statCol,
            index < stats.length - 1 && { borderRightColor: colors.divider, borderRightWidth: 1 },
          ]}
        >
          <Text
            style={[
              typography.h2,
              styles.valueText,
              { color: item.color, fontSize: scaleFont(20, 0.3) },
            ]}
          >
            {item.value}
          </Text>
          <Text style={[typography.caption, styles.labelText, { color: colors.textSecondary }]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  valueText: {
    fontWeight: '800',
    marginBottom: 3,
  },
  labelText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
