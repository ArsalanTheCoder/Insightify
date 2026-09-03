/**
 * Insightify — SafetyTipsCard (Component)
 *
 * Actionable prevention checklist card on Threat Detail screen:
 * Soft green card with 3 checkmark points (✅) and right 3D green shield checkmark.
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

export default function SafetyTipsCard({
  tips = [],
  style,
}) {
  const { typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const cardBg = isDark ? '#102C1E' : '#E8F8F0';
  const cardBorder = isDark ? '#1D4E35' : '#B8F0D3';
  const checkColor = isDark ? '#34D399' : '#059669';

  const defaultTips = [
    'Do not share OTPs or passwords with anyone.',
    'Do not click on links from unknown senders.',
    'Always verify from official app or website.',
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A', fontSize: scaleFont(16, 0.3) }]}>
        Safety Tips
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderRadius: radii.large,
          },
        ]}
      >
        {/* Left: Checklist Column */}
        <View style={styles.tipsCol}>
          {displayTips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <View style={[styles.checkCircle, { backgroundColor: checkColor }]}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
              <Text
                style={[
                  typography.bodySmall,
                  styles.tipText,
                  { color: isDark ? '#E2FBEF' : '#1E293B', fontSize: scaleFont(12.5, 0.3) },
                ]}
              >
                {tip}
              </Text>
            </View>
          ))}
        </View>

        {/* Right: 3D Shield Checkmark Badge */}
        <View style={[styles.shieldBox, { backgroundColor: isDark ? '#17402C' : '#D1F4E2' }]}>
          <Ionicons name="shield-checkmark" size={32} color={checkColor} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
  },
  tipsCol: {
    flex: 1,
    paddingRight: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  shieldBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
