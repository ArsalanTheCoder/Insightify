/**
 * Insightify — HistoryStatsGrid (Component)
 *
 * 2 compact summary metric cards on Scan History screen:
 * - Analyze Logs (24 / Total scans)
 * - Threats Detected (7 / Potential threats)
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function HistoryStatsGrid({
  totalScans = 24,
  totalThreats = 7,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();

  return (
    <View style={[styles.container, { gap: isSmallDevice ? 10 : 14 }, style]}>
      {/* Card 1: Analyze Logs */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: isDark ? '#141A33' : '#F4F3FF',
            borderColor: isDark ? '#232C52' : '#E8E5FF',
            borderRadius: radii.large,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#7C3AED' }]}>
            <Ionicons name="document-text" size={15} color="#FFFFFF" />
          </View>
          <Text style={[typography.caption, styles.cardCategory, { color: colors.textSecondary }]}>
            Analyze Logs
          </Text>
        </View>

        <Text style={[typography.h1, styles.statValue, { color: colors.textPrimary, fontSize: scaleFont(24, 0.3) }]}>
          {totalScans}
        </Text>
        <Text style={[typography.caption, styles.statLabel, { color: colors.textTertiary }]}>
          Total scans
        </Text>
      </View>

      {/* Card 2: Threats Detected */}
      <View
        style={[
          styles.statCard,
          {
            backgroundColor: isDark ? '#102C1E' : '#E8F8F0',
            borderColor: isDark ? '#1C4B33' : '#D1F4E2',
            borderRadius: radii.large,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#059669' }]}>
            <Ionicons name="shield-checkmark" size={15} color="#FFFFFF" />
          </View>
          <Text style={[typography.caption, styles.cardCategory, { color: colors.textSecondary }]}>
            Threats Detected
          </Text>
        </View>

        <Text style={[typography.h1, styles.statValue, { color: colors.textPrimary, fontSize: scaleFont(24, 0.3) }]}>
          {totalThreats}
        </Text>
        <Text style={[typography.caption, styles.statLabel, { color: colors.textTertiary }]}>
          Potential threats
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardCategory: {
    fontWeight: '600',
  },
  statValue: {
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontWeight: '500',
  },
});
