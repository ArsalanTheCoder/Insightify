/**
 * Insightify — IncidentContextSection (Component)
 *
 * Section 1: "What's happening?" on Threat Detail screen.
 * Clean, open layout with circular icon header and text directly on screen background.
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

export default function IncidentContextSection({
  whatIsHappening,
  style,
}) {
  const { typography, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const iconBg = isDark ? '#2D1218' : '#FEE2E2';
  const headingColor = isDark ? '#FB7185' : '#E11D48';

  return (
    <View style={[styles.container, style]}>
      {/* Header Row: Circle Icon + Red Section Title */}
      <View style={styles.headerRow}>
        <View style={[styles.circleIcon, { backgroundColor: iconBg }]}>
          <Ionicons name="skull-outline" size={16} color={headingColor} />
        </View>
        <Text style={[typography.h3, styles.heading, { color: headingColor, fontSize: scaleFont(16, 0.3) }]}>
          What's happening?
        </Text>
      </View>

      {/* Body: Clean text directly on normal screen background */}
      <Text
        style={[
          typography.body,
          styles.bodyText,
          { color: isDark ? '#E2E8F0' : '#475569', fontSize: scaleFont(13.5, 0.3) },
        ]}
      >
        {whatIsHappening}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  bodyText: {
    lineHeight: 21,
    paddingLeft: 42,
  },
});
