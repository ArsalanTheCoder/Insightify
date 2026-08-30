/**
 * Insightify — ProfileHeroCard (Component)
 *
 * User identity hero card:
 * - Avatar with ring border
 * - Name, role/title, Level pill badge
 * - Modern XP progress bar with "820 / 1000 XP" and "180 XP to Level 7" hint
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ProgressBar from '../../../shared/components/ProgressBar';

export default function ProfileHeroCard({ profile, style }) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  if (!profile) {
    return null;
  }

  const avatarSource =
    typeof profile.avatar === 'number'
      ? profile.avatar
      : profile.avatar?.uri
      ? { uri: profile.avatar.uri }
      : typeof profile.avatar === 'string'
      ? { uri: profile.avatar }
      : null;

  const currentXp = profile.xp || 0;
  const nextXp = profile.nextXp || 1000;
  const remaining = Math.max(0, nextXp - currentXp);
  const progress = nextXp > 0 ? currentXp / nextXp : 0;
  const nextLevel = (profile.level || 6) + 1;
  const level = profile.level || 6;

  const levelBgColor = isDark ? '#1E1B4B' : '#EEF2FF';
  const levelTextColor = isDark ? '#A5B4FC' : '#4F46E5';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      {/* Top Row: Avatar Left, User Details Right */}
      <View style={styles.topRow}>
        {/* Avatar with Circular Ring */}
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
            <Text style={[styles.avatarInitials, { color: colors.textPrimary }]}>
              {(profile.name || 'U').charAt(0)}
            </Text>
          </View>
        )}

        {/* User Info Column */}
        <View style={styles.infoCol}>
          <Text
            numberOfLines={1}
            style={[
              typography.h2,
              styles.name,
              { color: colors.textPrimary, fontSize: scaleFont(18, 0.3) },
            ]}
          >
            {profile.name}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              typography.caption,
              styles.roleTitle,
              { color: colors.textSecondary, fontSize: scaleFont(12.5, 0.3) },
            ]}
          >
            {profile.title}
          </Text>

          {/* Level Pill Badge */}
          <View
            style={[
              styles.levelBadge,
              {
                backgroundColor: levelBgColor,
                borderRadius: radii.pill,
              },
            ]}
          >
            <Text
              style={[
                styles.levelText,
                { color: levelTextColor, fontSize: scaleFont(11, 0.3) },
              ]}
            >
              Level {level}
            </Text>
          </View>
        </View>
      </View>

      {/* XP Progress Section */}
      <View style={styles.xpSection}>
        {/* Row: XP value left, next-level hint right */}
        <View style={styles.xpTopRow}>
          <Text
            style={[
              styles.xpMainLabel,
              { color: colors.textPrimary, fontSize: scaleFont(12.5, 0.3) },
            ]}
          >
            {currentXp.toLocaleString()} / {nextXp.toLocaleString()} XP
          </Text>
          <Text
            style={[
              styles.xpHintLabel,
              { color: colors.textSecondary, fontSize: scaleFont(11, 0.3) },
            ]}
          >
            {remaining} XP to Level {nextLevel}
          </Text>
        </View>

        {/* Styled Progress Bar */}
        <ProgressBar
          progress={progress}
          height={8}
          fillColor="#4F46E5"
        />

        {/* Percentage indicator row */}
        <View style={styles.xpBottomRow}>
          <View style={[styles.progressDot, { backgroundColor: '#4F46E5' }]} />
          <Text
            style={[
              styles.progressPctLabel,
              { color: levelTextColor, fontSize: scaleFont(10.5, 0.3) },
            ]}
          >
            {Math.round(progress * 100)}% complete
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#4F46E5',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#4F46E5',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '800',
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontWeight: '800',
    marginBottom: 2,
  },
  roleTitle: {
    fontWeight: '500',
    marginBottom: 6,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  levelText: {
    fontWeight: '700',
  },
  xpSection: {
    width: '100%',
  },
  xpTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpMainLabel: {
    fontWeight: '700',
  },
  xpHintLabel: {
    fontWeight: '500',
  },
  xpBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  progressPctLabel: {
    fontWeight: '600',
  },
});
