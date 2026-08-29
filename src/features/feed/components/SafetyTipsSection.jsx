/**
 * Insightify — SafetyTipsSection (Component)
 *
 * Section 4: "Safety Tips" on Threat Detail screen.
 * Clean, open layout with circular shield icon header and green bullet checklist directly on screen background.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
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

export default function SafetyTipsSection({
  tips = [],
  style,
}) {
  const { typography, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const iconBg = isDark ? '#102C1E' : '#E8F8F0';
  const headingColor = isDark ? '#34D399' : '#10B981';
  const bulletColor = isDark ? '#34D399' : '#10B981';

  const defaultTips = [
    'Avoid clicking on links from unknown or unverified ads.',
    'Never enter your login details on suspicious pages.',
    'Report the ad and warn others in the community.',
  ];

  const displayTips = tips && tips.length > 0 ? tips : defaultTips;

  return (
    <View style={[styles.container, style]}>
      {/* Header Row: Circle Icon + Green Section Title */}
      <View style={styles.headerRow}>
        <View style={[styles.circleIcon, { backgroundColor: iconBg }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={headingColor} />
        </View>
        <Text style={[typography.h3, styles.heading, { color: headingColor, fontSize: scaleFont(16, 0.3) }]}>
          Safety Tips
        </Text>
      </View>

      {/* Checklist items directly on normal screen background */}
      <View style={styles.listContainer}>
        {displayTips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            {/* Small Green Dot Bullet */}
            <View style={[styles.bulletDot, { backgroundColor: bulletColor }]} />
            <Text
              style={[
                typography.body,
                styles.tipText,
                { color: isDark ? '#E2E8F0' : '#475569', fontSize: scaleFont(13.5, 0.3) },
              ]}
            >
              {tip}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heading: {
    fontWeight: '700',
  },
  listContainer: {
    paddingLeft: 42,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    lineHeight: 20,
  },
});
