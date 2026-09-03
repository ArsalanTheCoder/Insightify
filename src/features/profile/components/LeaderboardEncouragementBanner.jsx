/**
 * Insightify — LeaderboardEncouragementBanner (Component)
 *
 * Bottom encouragement banner on LeaderboardScreen:
 * - Blue/purple gradient card
 * - 3D Trophy icon
 * - "Keep it up! You're in the top 10% of Insightify Guardians."
 * - Circular arrow button
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function LeaderboardEncouragementBanner({
  onPress,
  style,
}) {
  const { radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const gradientColors = isDark
    ? ['#2563EB', '#4338CA']
    : ['#3B82F6', '#6366F1'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.banner, { borderRadius: radii.large }, style]}
    >
      {/* 3D Trophy Icon */}
      <View style={styles.trophyWrapper}>
        <Text style={styles.trophyEmoji}>🏆</Text>
      </View>

      {/* Center Text Column */}
      <View style={styles.textCol}>
        <Text style={[styles.title, { fontSize: scaleFont(15.5, 0.3) }]}>
          Keep it up!
        </Text>
        <Text style={[styles.subtitle, { fontSize: scaleFont(12, 0.3) }]}>
          You're in the top 10% of Insightify Guardians.
        </Text>
      </View>

      {/* Right Circular Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.arrowBtn}
        accessibilityRole="button"
        accessibilityLabel="View achievements and progress"
      >
        <Ionicons name="chevron-forward" size={18} color="#4F46E5" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 6,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  trophyWrapper: {
    marginRight: 14,
  },
  trophyEmoji: {
    fontSize: 36,
  },
  textCol: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 3,
  },
  subtitle: {
    color: '#E0EEFF',
    fontWeight: '500',
    lineHeight: 16,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
