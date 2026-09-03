/**
 * Insightify — DailySafetyTipCard (Component)
 *
 * Micro-education daily tip banner matching the approved UI reference:
 * Left: 3D star shield badge
 * Middle: "Daily Safety Tip" title + practical guidance
 * Right: Circular navigation arrow button (→) linking to Learn module.
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.6
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

export default function DailySafetyTipCard({
  tip,
  onPress,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();

  const title = tip?.title || 'Daily Safety Tip';
  const content = tip?.content || 'Never share OTPs, passwords, or personal information with anyone. Stay safe!';

  const cardBg = isDark ? '#0E2442' : '#F0F6FF';
  const borderCol = isDark ? '#1C3A63' : '#DCE8FD';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor: borderCol,
          borderRadius: radii.large,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Daily Safety Tip: ${content}`}
    >
      {/* Left: 3D Star Shield Icon Badge */}
      <View style={styles.iconWrapper}>
        <View style={[styles.shieldBadge, { backgroundColor: colors.primary }]}>
          <Ionicons name="star" size={20} color="#FFFFFF" />
        </View>
      </View>

      {/* Center: Title & Practical Tip Text */}
      <View style={styles.textCol}>
        <Text style={[typography.label, styles.tipTitle, { color: colors.primary }]}>
          {title}
        </Text>
        <Text
          numberOfLines={3}
          style={[typography.bodySmall, styles.tipContent, { color: colors.textSecondary }]}
        >
          {content}
        </Text>
      </View>

      {/* Right: Circular Navigation Arrow Button */}
      <View style={[styles.arrowButton, { backgroundColor: colors.surface, borderColor: borderCol }]}>
        <Ionicons name="arrow-forward" size={18} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconWrapper: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },
  tipContent: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
