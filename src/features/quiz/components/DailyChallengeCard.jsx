/**
 * Insightify — DailyChallengeCard (Quiz Component)
 *
 * Daily challenge banner card on QuizDashboardScreen.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function DailyChallengeCard({
  challenge,
  onPlay,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const title = challenge?.title || 'Spot the Real Link';
  const subtitle = challenge?.subtitle || 'Can you identify the real website?';
  const rewardXp = challenge?.rewardXp || 50;
  const timeRemaining = challenge?.timeRemaining || '07:45:32';

  return (
    <View style={styles.container}>
      {/* Header with timer */}
      <View style={styles.headerRow}>
        <Text
          style={[
            typography.h3,
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
          ]}
        >
          Daily Challenge
        </Text>
        <View style={styles.timerRow}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text
            style={[
              styles.timerText,
              { color: colors.primary, fontSize: scaleFont(12, 0.3) },
            ]}
          >
            {timeRemaining}
          </Text>
        </View>
      </View>

      {/* Challenge card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary, borderRadius: 12 }]}>
          <Ionicons name="globe-outline" size={24} color={colors.primary} />
        </View>

        <View style={styles.infoWrap}>
          <Text
            numberOfLines={1}
            style={[
              typography.h3,
              styles.title,
              { color: colors.textPrimary, fontSize: scaleFont(14, 0.3) },
            ]}
          >
            {title}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              typography.caption,
              styles.subtitle,
              { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            {subtitle}
          </Text>
          <View
            style={[
              styles.xpBadge,
              { backgroundColor: colors.xpSoft, borderRadius: radii.pill || 999 },
            ]}
          >
            <Text
              style={[
                styles.xpBadgeText,
                { color: colors.xp, fontSize: scaleFont(11, 0.3) },
              ]}
            >
              +{rewardXp} XP
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPlay}
          style={[
            styles.playBtn,
            { backgroundColor: colors.primary, borderRadius: radii.pill || 999 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Play daily challenge"
        >
          <Text style={[styles.playBtnText, { fontSize: scaleFont(12.5, 0.3) }]}>
            Play Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontWeight: '800',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoWrap: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: 6,
  },
  xpBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  xpBadgeText: {
    fontWeight: '800',
  },
  playBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
