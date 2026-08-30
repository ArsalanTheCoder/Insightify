/**
 * Insightify — AchievementCard (Component)
 *
 * Achievement item card on AchievementsScreen matching approved UI reference:
 * - Unlocked: Vector icon box, title, description, points, level pill badge, unlock date.
 * - Locked: Vector icon box, title, description, points, lock icon.
 *
 * AGENTS.md & docs/RULES.md
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

export default function AchievementCard({
  item,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  if (!item) {
    return null;
  }

  const isUnlocked = !!item.unlocked;
  const iconName = item.iconName || 'shield-checkmark';
  const iconColor = item.iconColor || colors.primary;

  const cardBg = colors.surface;
  const boxBg = isDark
    ? '#141A28'
    : item.bg || '#EFF6FF';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      {/* 1. Left: Icon Box */}
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: boxBg,
            borderRadius: radii.medium,
          },
        ]}
      >
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>

      {/* 2. Center: Title, Description, and Points */}
      <View style={styles.centerCol}>
        <Text
          numberOfLines={2}
          style={[
            typography.h3,
            styles.title,
            { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={2}
          style={[
            typography.caption,
            styles.desc,
            { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
          ]}
        >
          {item.desc}
        </Text>

        <Text
          style={[
            styles.pointsText,
            { color: isDark ? '#A5B4FC' : '#4F46E5', fontSize: scaleFont(12, 0.3) },
          ]}
        >
          {item.points || 0} pts
        </Text>
      </View>

      {/* 3. Right: Level & Date (Unlocked) OR Lock Icon (Locked) */}
      <View style={styles.rightCol}>
        {isUnlocked ? (
          <View style={styles.unlockedRightGroup}>
            {/* Level Pill Badge */}
            <View
              style={[
                styles.levelPill,
                {
                  backgroundColor: item.pillBg || '#D1FAE5',
                  borderRadius: radii.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.levelPillText,
                  { color: item.pillTextColor || '#047857', fontSize: scaleFont(10.5, 0.3) },
                ]}
              >
                {item.level || 'Level 1'}
              </Text>
            </View>

            {/* Unlocked Date Subtext */}
            <Text style={[styles.statusText, { color: colors.textSecondary, fontSize: scaleFont(10.5, 0.3) }]}>
              Unlocked
            </Text>
            {item.unlockedDate ? (
              <Text style={[styles.dateText, { color: colors.textTertiary, fontSize: scaleFont(10, 0.3) }]}>
                {item.unlockedDate}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.lockedRightGroup}>
            <Ionicons name="lock-closed" size={20} color={isDark ? '#64748B' : '#94A3B8'} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  centerCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: '800',
    marginBottom: 2,
  },
  desc: {
    lineHeight: 16,
    marginBottom: 4,
  },
  pointsText: {
    fontWeight: '800',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  unlockedRightGroup: {
    alignItems: 'flex-end',
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 4,
  },
  levelPillText: {
    fontWeight: '800',
  },
  statusText: {
    fontWeight: '600',
  },
  dateText: {
    fontWeight: '400',
    marginTop: 1,
  },
  lockedRightGroup: {
    paddingRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
