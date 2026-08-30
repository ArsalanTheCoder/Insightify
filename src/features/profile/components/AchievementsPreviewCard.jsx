/**
 * Insightify — AchievementsPreviewCard (Component)
 *
 * Achievements section on Profile screen matching the approved UI reference:
 * - Header: "Achievements" + "View All >"
 * - 4 Badges in a single horizontal row:
 *   1. Scam Spotter (Level 3) - Blue Shield
 *   2. 7 Day Streak (Level 2) - Orange Flame
 *   3. First Detection (Level 1) - Gold Trophy
 *   4. Community (Level 2) - Purple Ribbon
 *
 * Fully responsive, no aggressive text truncation (...), equal card heights and clean wrapping.
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import SectionTitle from '../../../shared/components/SectionTitle';

// Predefined fallback visual mapping to guarantee exact icons and colors
const BADGE_VISUALS = {
  a1: {
    iconName: 'shield-checkmark',
    iconColor: '#2563EB',
    bg: '#F0F7FF',
    circleBg: '#DBEAFE',
    darkBg: '#0F1E38',
    darkCircleBg: '#1E2D4A',
  },
  a2: {
    iconName: 'flame',
    iconColor: '#EA580C',
    bg: '#FFF7ED',
    circleBg: '#FFEDD5',
    darkBg: '#261810',
    darkCircleBg: '#3A2315',
  },
  a3: {
    iconName: 'trophy',
    iconColor: '#CA8A04',
    bg: '#FEFCE8',
    circleBg: '#FEF08A',
    darkBg: '#24200E',
    darkCircleBg: '#383214',
  },
  a4: {
    iconName: 'ribbon',
    iconColor: '#9333EA',
    bg: '#FAF5FF',
    circleBg: '#F3E8FF',
    darkBg: '#221433',
    darkCircleBg: '#351E4F',
  },
};

export default function AchievementsPreviewCard({
  achievements = [],
  onViewAll,
  onBadgePress,
  style,
}) {
  const { colors, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const previewList = achievements.slice(0, 4);

  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      <SectionTitle
        title="Achievements"
        actionText="View All"
        onActionPress={onViewAll}
      />

      {/* 4 Badges Row */}
      <View style={styles.badgeRow}>
        {previewList.map((item, index) => {
          const defaultKey = `a${index + 1}`;
          const visual = BADGE_VISUALS[item.id] || BADGE_VISUALS[defaultKey] || BADGE_VISUALS.a1;

          const cardBg = isDark
            ? item.darkBg || visual.darkBg
            : item.bg || visual.bg;

          const circleBg = isDark
            ? item.darkCircleBg || visual.darkCircleBg
            : item.circleBg || visual.circleBg;

          const iconColor = item.iconColor || visual.iconColor;
          const iconName = item.iconName || visual.iconName;

          return (
            <TouchableOpacity
              key={item.id || index}
              activeOpacity={0.8}
              onPress={() => onBadgePress ? onBadgePress(item) : onViewAll && onViewAll()}
              style={[
                styles.badgeCard,
                {
                  backgroundColor: cardBg,
                  borderColor: isDark ? '#1E293B' : 'rgba(0,0,0,0.03)',
                  borderRadius: radii.large,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.level || 'Level 1'}`}
            >
              {/* Circular Inner Icon Glow */}
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: circleBg,
                  },
                ]}
              >
                <Ionicons name={iconName} size={22} color={iconColor} />
              </View>

              {/* Title Container with controlled 2-line wrapping & zero ellipsis clipping */}
              <View style={styles.titleContainer}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.badgeTitle,
                    {
                      color: colors.textPrimary,
                      fontSize: scaleFont(11, 0.2),
                      lineHeight: scaleFont(13.5, 0.2),
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              {/* Level Subtitle */}
              <Text
                numberOfLines={1}
                style={[
                  styles.badgeLevel,
                  {
                    color: colors.textSecondary,
                    fontSize: scaleFont(10, 0.2),
                  },
                ]}
              >
                {item.level || 'Level 1'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 6,
  },
  badgeCard: {
    flex: 1,
    minHeight: 114,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  titleContainer: {
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  badgeTitle: {
    fontWeight: '800',
    textAlign: 'center',
  },
  badgeLevel: {
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
});
