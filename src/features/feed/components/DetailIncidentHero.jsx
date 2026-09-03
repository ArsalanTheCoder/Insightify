/**
 * Insightify — DetailIncidentHero (Component)
 *
 * Top incident header on Threat Detail screen matching the visual reference:
 * - Left: Severity pill badge (⚠️ MEDIUM RISK), bold title, metadata (location, time, views)
 * - Right: Soft rounded square card with 3D illustration and alert dot
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function DetailIncidentHero({ threat, style }) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const isHighRisk = threat.riskLevel === 'HIGH';
  const isMediumRisk = threat.riskLevel === 'MEDIUM';

  const riskBg = isHighRisk
    ? (isDark ? '#3E1616' : '#FEE2E2')
    : isMediumRisk
    ? (isDark ? '#3D2808' : '#FEF3C7')
    : (isDark ? '#0E2442' : '#E0F2FE');

  const riskText = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#0284C7';

  const riskIcon = isHighRisk
    ? 'warning'
    : isMediumRisk
    ? 'warning'
    : 'information-circle';

  return (
    <View style={[styles.container, style]}>
      {/* Left Column: Severity Pill, Title, Meta */}
      <View style={styles.leftCol}>
        {/* Severity Pill Badge */}
        <View style={[styles.riskBadge, { backgroundColor: riskBg, borderRadius: radii.pill }]}>
          <Ionicons name={riskIcon} size={13} color={riskText} style={styles.riskIcon} />
          <Text style={[styles.riskText, { color: riskText }]}>
            {threat.riskLevel} RISK
          </Text>
        </View>

        {/* Title */}
        <Text
          style={[
            typography.h1,
            styles.title,
            { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) },
          ]}
        >
          {threat.title}
        </Text>

        {/* Metadata: Location • Time • Views */}
        <View style={styles.metaRow}>
          {threat.location ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {threat.location}
              </Text>
            </View>
          ) : null}

          <Text style={[styles.dotSeparator, { color: colors.textTertiary }]}>•</Text>

          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {threat.timeAgo}
            </Text>
          </View>

          {threat.viewCount ? (
            <>
              <Text style={[styles.dotSeparator, { color: colors.textTertiary }]}>•</Text>
              <View style={styles.metaItem}>
                <Ionicons name="eye-outline" size={13} color={colors.textTertiary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {threat.viewCount} views
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </View>

      {/* Right Column: Soft Tinted Illustration Card */}
      {threat.heroAsset ? (
        <View
          style={[
            styles.illustrationCard,
            {
              backgroundColor: isDark ? '#2A2010' : '#FEF3C7',
              borderRadius: radii.large,
            },
          ]}
        >
          <Image
            source={threat.heroAsset}
            style={styles.heroImage}
            resizeMode="contain"
            fadeDuration={0}
          />
          {/* Exclamation Alert Bubble */}
          <View style={[styles.alertDot, { backgroundColor: riskText }]}>
            <Text style={styles.alertDotText}>!</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 2,
  },
  leftCol: {
    flex: 1,
    paddingRight: 14,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 10,
  },
  riskIcon: {
    marginRight: 4,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dotSeparator: {
    fontSize: 12,
    marginHorizontal: 1,
  },
  illustrationCard: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 6,
  },
  heroImage: {
    width: 44,
    height: 44,
  },
  alertDot: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  alertDotText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    lineHeight: 11,
  },
});
