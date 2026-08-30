/**
 * Insightify — AchievementsScreen (Feature Screen)
 *
 * Dedicated Achievements Screen matching approved UI reference:
 * - Top header with back button and filter icon
 * - Gradient Trophy Banner: "12 / 28 Achievements Unlocked" with 3D Trophy
 * - Your Progress Card: "Level 6", XP progress bar, "To next level: 180 XP"
 * - Segmented Filter: All | Unlocked | Locked
 * - Grouped lists for UNLOCKED and LOCKED achievements
 * - Bottom "Keep going! Unlock more achievements and level up" banner
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useAchievements } from '../hooks/useAchievements';
import { useProfile } from '../hooks/useProfile';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ProgressBar from '../../../shared/components/ProgressBar';
import AchievementCard from '../components/AchievementCard';

export default function AchievementsScreen() {
  const navigation = useNavigation();
  const { colors, typography, radii, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const { profile } = useProfile();
  const {
    filter,
    setFilter,
    filters,
    achievements,
    unlockedAchievements,
    lockedAchievements,
    totalCount,
    unlockedCount,
    isLoading,
  } = useAchievements('All');

  const currentXp = profile?.xp || 820;
  const nextXp = profile?.nextXp || 1000;
  const xpRemaining = Math.max(0, nextXp - currentXp);
  const xpProgress = nextXp > 0 ? currentXp / nextXp : 0.82;
  const userLevel = profile?.level || 6;

  const bannerGradients = isDark
    ? ['#2563EB', '#4F46E5', '#7C3AED']
    : ['#3B82F6', '#4F46E5', '#6366F1'];

  const bottomScrollPadding = (insets.bottom || 8) + 95;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* 1. Header Row (Back Arrow + Title + Filter Action) */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.headerBtn, { backgroundColor: isDark ? '#102038' : '#F1F5F9' }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[typography.h2, styles.headerTitle, { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) }]}>
          Achievements
        </Text>

        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          style={[styles.headerBtn, { backgroundColor: isDark ? '#102038' : '#F1F5F9' }]}
          accessibilityRole="button"
          accessibilityLabel="Filter achievements"
        >
          <Ionicons name="funnel-outline" size={18} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* 2. Top Gradient Trophy Banner (12 / 28 Achievements Unlocked) */}
      <LinearGradient
        colors={bannerGradients}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.trophyBanner, { borderRadius: radii.large }]}
      >
        <View style={styles.bannerTextCol}>
          <Text style={[styles.bannerCountText, { fontSize: scaleFont(26, 0.3) }]}>
            {unlockedCount} / {totalCount}
          </Text>
          <Text style={[styles.bannerSubText, { fontSize: scaleFont(13, 0.3) }]}>
            Achievements Unlocked
          </Text>
        </View>

        <View style={styles.trophyWrapper}>
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={styles.sparkleEmoji}>✨</Text>
        </View>
      </LinearGradient>

      {/* 3. Your Progress Card */}
      <View
        style={[
          styles.progressCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <View style={styles.progressTopRow}>
          <Text style={[typography.h3, styles.progressTitle, { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) }]}>
            Your Progress
          </Text>

          <View style={[styles.levelPill, { backgroundColor: isDark ? '#1E1B4B' : '#F5F3FF', borderRadius: radii.pill }]}>
            <Text style={[styles.levelPillText, { color: isDark ? '#A5B4FC' : '#6366F1', fontSize: scaleFont(12, 0.3) }]}>
              Level {userLevel} ⚙️
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <ProgressBar progress={xpProgress} height={8} fillColor="#6366F1" />
        </View>

        {/* Bottom XP Labels */}
        <View style={styles.progressBottomRow}>
          <Text style={[typography.caption, { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) }]}>
            {currentXp} / {nextXp} XP
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) }]}>
            To next level: {xpRemaining} XP
          </Text>
        </View>
      </View>

      {/* 4. Filter Pills Segment (All | Unlocked | Locked) */}
      <View
        style={[
          styles.filterSegment,
          {
            backgroundColor: isDark ? '#102038' : '#F1F5F9',
            borderRadius: radii.pill,
          },
        ]}
      >
        {filters.map((f) => {
          const isActive = filter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
              style={[
                styles.filterTab,
                isActive && [styles.filterTabActive, { backgroundColor: '#4F46E5', borderRadius: radii.pill }],
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Show ${f} achievements`}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color: isActive ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: scaleFont(13, 0.3),
                  },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 5. Achievement Cards List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filter === 'All' ? (
        <View style={styles.listContainer}>
          {/* UNLOCKED Section */}
          <Text style={[styles.sectionHeaderLabel, { color: colors.textSecondary }]}>
            UNLOCKED
          </Text>
          {unlockedAchievements.map((item) => (
            <AchievementCard key={item.id} item={item} />
          ))}

          {/* LOCKED Section */}
          <Text style={[styles.sectionHeaderLabel, { color: colors.textSecondary, marginTop: 12 }]}>
            LOCKED
          </Text>
          {lockedAchievements.map((item) => (
            <AchievementCard key={item.id} item={item} />
          ))}
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Text style={[styles.sectionHeaderLabel, { color: colors.textSecondary }]}>
            {filter.toUpperCase()}
          </Text>
          {achievements.map((item) => (
            <AchievementCard key={item.id} item={item} />
          ))}
        </View>
      )}

      {/* 6. "Keep going!" Encouragement Banner */}
      <View
        style={[
          styles.keepGoingBanner,
          {
            backgroundColor: isDark ? '#2D2610' : '#FFFBEB',
            borderColor: isDark ? '#423714' : '#FEF08A',
            borderRadius: radii.large,
          },
        ]}
      >
        <View style={styles.keepGoingLeft}>
          <Ionicons name="star-outline" size={24} color="#D97706" style={{ marginRight: 12 }} />
          <View style={styles.keepGoingTextCol}>
            <Text style={[styles.keepGoingTitle, { color: isDark ? '#FDE68A' : '#92400E', fontSize: scaleFont(14.5, 0.3) }]}>
              Keep going!
            </Text>
            <Text style={[styles.keepGoingSub, { color: isDark ? '#D97706' : '#A16207', fontSize: scaleFont(12, 0.3) }]}>
              Unlock more achievements and level up
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={16} color={isDark ? '#FDE68A' : '#B45309'} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  trophyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerCountText: {
    color: '#FFFFFF',
    fontWeight: '900',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  bannerSubText: {
    color: '#E0EEFF',
    fontWeight: '600',
  },
  trophyWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyEmoji: {
    fontSize: 44,
  },
  sparkleEmoji: {
    position: 'absolute',
    top: -6,
    right: -4,
    fontSize: 16,
  },
  progressCard: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: '800',
  },
  levelPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  levelPillText: {
    fontWeight: '800',
  },
  progressBarWrapper: {
    marginBottom: 8,
  },
  progressBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    elevation: 2,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  filterTabText: {
    textAlign: 'center',
  },
  sectionHeaderLabel: {
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  listContainer: {
    paddingBottom: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  keepGoingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  keepGoingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  keepGoingTextCol: {
    flex: 1,
  },
  keepGoingTitle: {
    fontWeight: '800',
    marginBottom: 2,
  },
  keepGoingSub: {
    fontWeight: '500',
  },
});
