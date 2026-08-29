/**
 * Insightify — ThreatPreviewCard (Component)
 *
 * Card component for individual threat preview items matching the approved UI reference:
 * - Risk severity badge (! HIGH RISK / ! MEDIUM RISK)
 * - Title & Description
 * - Location tag (📍 Pakistan) + Timestamp (🕒 2m ago)
 * - Right threat graphic icon badge
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.5
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

export default function ThreatPreviewCard({ threat, onPress, style }) {
  const { colors, typography, radii, isDark } = useTheme();

  const isHighRisk = threat.riskLevel === 'HIGH';
  const riskBg = isHighRisk
    ? (isDark ? '#3E1616' : '#FEE2E2')
    : (isDark ? '#3D2808' : '#FEF3C7');
  const riskText = isHighRisk ? '#EF4444' : '#F59E0B';

  const iconBg = threat.iconType === 'link'
    ? (isDark ? '#102C1E' : '#E8F8F0')
    : (isDark ? '#102038' : '#EBF5FF');
  const mainIcon = threat.iconType === 'link' ? 'link' : 'mail';
  const mainIconColor = threat.iconType === 'link' ? '#059669' : '#2563EB';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(threat)}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${threat.riskLevel} risk threat: ${threat.title}`}
    >
      {/* Left Content Column */}
      <View style={styles.leftCol}>
        {/* Risk Badge */}
        <View style={[styles.riskBadge, { backgroundColor: riskBg }]}>
          <Ionicons
            name="alert-circle"
            size={11}
            color={riskText}
            style={styles.riskIcon}
          />
          <Text style={[styles.riskText, { color: riskText }]}>
            {threat.riskLevel} RISK
          </Text>
        </View>

        {/* Title */}
        <Text
          numberOfLines={1}
          style={[typography.bodyLarge, styles.title, { color: colors.textPrimary }]}
        >
          {threat.title}
        </Text>

        {/* Description */}
        <Text
          numberOfLines={2}
          style={[typography.bodySmall, styles.description, { color: colors.textSecondary }]}
        >
          {threat.description}
        </Text>

        {/* Metadata Row: Location + Time */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {threat.location}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {threat.timeAgo}
            </Text>
          </View>
        </View>
      </View>

      {/* Right Icon Graphic Box */}
      <View style={[styles.rightGraphicBox, { backgroundColor: iconBg, borderColor: colors.border }]}>
        <Ionicons name={mainIcon} size={26} color={mainIconColor} />
        {/* Small Exclamation Alert Badge on Icon */}
        <View style={[styles.alertDot, { backgroundColor: riskText }]}>
          <Text style={styles.alertExclamation}>!</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  leftCol: {
    flex: 1,
    paddingRight: 10,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    marginBottom: 5,
  },
  riskIcon: {
    marginRight: 3,
  },
  riskText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
  },
  rightGraphicBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertExclamation: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    lineHeight: 10,
  },
});
