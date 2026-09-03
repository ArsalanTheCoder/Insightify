/**
 * Insightify — IncidentContextCard (Component)
 *
 * "What's happening?" explanation banner on Threat Detail screen.
 * Soft peach/burgundy tinted card with attacker motivation explanation and hacker icon graphic.
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

export default function IncidentContextCard({
  whatIsHappening,
  style,
}) {
  const { typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const cardBg = isDark ? '#261218' : '#FFF1F2';
  const cardBorder = isDark ? '#4A1D27' : '#FCE7E9';
  const headingColor = isDark ? '#FB7185' : '#E11D48';

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      {/* Left Explanation Text */}
      <View style={styles.textCol}>
        <Text style={[typography.h3, styles.heading, { color: headingColor, fontSize: scaleFont(15, 0.3) }]}>
          What's happening?
        </Text>
        <Text
          style={[
            typography.bodySmall,
            styles.bodyText,
            { color: isDark ? '#F1D8DE' : '#64748B', fontSize: scaleFont(13, 0.3) },
          ]}
        >
          {whatIsHappening}
        </Text>
      </View>

      {/* Right 3D Hacker / Threat Graphic Badge */}
      <View style={[styles.iconBox, { backgroundColor: isDark ? '#3D1B24' : '#FFE4E6' }]}>
        <Ionicons name="skull-outline" size={28} color={headingColor} />
        {/* Small Exclamation Alert Bubble */}
        <View style={styles.alertBubble}>
          <Ionicons name="alert" size={10} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    marginBottom: 22,
    elevation: 1,
  },
  textCol: {
    flex: 1,
    paddingRight: 10,
  },
  heading: {
    fontWeight: '700',
    marginBottom: 6,
  },
  bodyText: {
    lineHeight: 19,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertBubble: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
