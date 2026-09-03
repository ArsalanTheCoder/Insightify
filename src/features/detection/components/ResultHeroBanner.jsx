/**
 * Insightify — ResultHeroBanner (Component)
 *
 * Dynamic hero banner on Scan Result screen:
 * 3D Shield status graphic, severity pill, dynamic outcome title & subtitle,
 * and 4-segment spectrum risk gauge.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 7
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import SpectrumGauge from './SpectrumGauge';

export default function ResultHeroBanner({ result, style }) {
  const { typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const isHighRisk = result.riskLevel === 'HIGH';
  const isMediumRisk = result.riskLevel === 'MEDIUM';

  const gradientColors = isHighRisk
    ? isDark
      ? ['#2D1218', '#3D1B24']
      : ['#FFF1F2', '#FFE4E6']
    : isMediumRisk
    ? isDark
      ? ['#2D2010', '#3D2B15']
      : ['#FEF3C7', '#FDE68A']
    : isDark
    ? ['#102C1E', '#17402C']
    : ['#E8F8F0', '#D1F4E2'];

  const themeColor = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#10B981';

  const shieldIcon = isHighRisk ? 'alert' : isMediumRisk ? 'warning' : 'checkmark';
  const riskBadgeLabel = isHighRisk ? 'HIGH RISK' : isMediumRisk ? 'MEDIUM RISK' : 'LOW RISK';

  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderRadius: radii.large }]}
      >
        {/* Top Row: 3D Shield Icon + Severity Pill */}
        <View style={styles.topRow}>
          {/* Shield Graphic Box */}
          <View style={[styles.shieldBox, { backgroundColor: themeColor }]}>
            <Ionicons name={shieldIcon} size={24} color="#FFFFFF" />
          </View>

          {/* Severity Pill */}
          <View
            style={[
              styles.riskPill,
              {
                backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.85)',
                borderRadius: radii.pill,
              },
            ]}
          >
            <Text style={[styles.riskPillText, { color: themeColor }]}>
              {riskBadgeLabel}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          style={[
            typography.h1,
            styles.title,
            { color: isDark ? '#FFFFFF' : '#0F172A', fontSize: scaleFont(22, 0.3) },
          ]}
        >
          {result.heroTitle}
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            typography.body,
            styles.subtitle,
            { color: isDark ? '#E2E8F0' : '#475569', fontSize: scaleFont(13.5, 0.3) },
          ]}
        >
          {result.heroSubtitle}
        </Text>

        {/* Spectrum Risk Score Gauge */}
        <SpectrumGauge riskLevel={result.riskLevel} style={{ marginTop: 12 }} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  card: {
    padding: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  shieldBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  riskPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    lineHeight: 20,
  },
});
