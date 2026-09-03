/**
 * Insightify — QuizXpProgressCard (Quiz Component)
 *
 * Modern, compact Learning Progress Card for QuizDashboardScreen:
 * - Small Level shield badge
 * - Main title "AI Awareness Champion" & supporting text
 * - Dynamic XP counter (e.g. 820 / 1000 XP)
 * - Rounded XP progress bar with gradient fill
 * - Percentage & remaining XP to next level (e.g. 82% • 180 XP to Level 7)
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function QuizXpProgressCard({
  level = 6,
  title = 'AI Awareness Champion',
  xp = 820,
  nextXp = 1000,
}) {
  const { typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const progressRatio = Math.max(0, Math.min(1, xp / (nextXp || 1000)));
  const percentage = Math.round(progressRatio * 100);
  const remainingXp = Math.max(0, (nextXp || 1000) - xp);
  const nextLevel = level + 1;

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#6D28D9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderRadius: radii.large }]}
    >
      {/* 1. Top Row: Level Shield Badge & XP Counter */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.levelBadge,
            { borderRadius: radii.pill || 999 },
          ]}
        >
          <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" />
          <Text
            style={[
              styles.levelBadgeText,
              { fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            Level {level}
          </Text>
        </View>

        <View
          style={[
            styles.xpPill,
            { borderRadius: radii.pill || 999 },
          ]}
        >
          <Ionicons name="sparkles" size={12} color="#FDE047" />
          <Text
            style={[
              styles.xpNumbersText,
              { fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            {xp} / {nextXp} XP
          </Text>
        </View>
      </View>

      {/* 2. Main Title & Supporting Text */}
      <View style={styles.titleSection}>
        <Text
          numberOfLines={1}
          style={[
            typography.h2,
            styles.championTitle,
            { fontSize: scaleFont(16.5, 0.3) },
          ]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            typography.caption,
            styles.supportingText,
            { fontSize: scaleFont(12, 0.3) },
          ]}
        >
          Keep building your cyber skills.
        </Text>
      </View>

      {/* 3. Rounded Progress Bar Track & Footer Info */}
      <View style={styles.progressSection}>
        <View style={styles.track}>
          <LinearGradient
            colors={['#60A5FA', '#A78BFA', '#F472B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { width: `${percentage}%` }]}
          />
        </View>

        <View style={styles.footerRow}>
          <Text
            style={[
              styles.footerText,
              { fontSize: scaleFont(11, 0.3) },
            ]}
          >
            {percentage}% Complete
          </Text>
          <Text
            style={[
              styles.footerText,
              { fontSize: scaleFont(11, 0.3) },
            ]}
          >
            {remainingXp} XP to Level {nextLevel}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    gap: 4,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    gap: 4,
  },
  xpNumbersText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  titleSection: {
    marginBottom: 10,
  },
  championTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 1,
  },
  supportingText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  progressSection: {
    gap: 5,
  },
  track: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
});
