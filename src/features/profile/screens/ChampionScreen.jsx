/**
 * Insightify — ChampionScreen (Feature Screen)
 *
 * Guardian / User Profile Detail view matching approved UI reference:
 * - Back + Share top bar
 * - Hero card: avatar with blue ring, decorative shield watermark, sparkles
 * - Crown ONLY for rank #1; rank medal emoji for others
 * - Awareness Points row with today's delta
 * - Modern Progress section: current level, XP bar with thumb indicator, XP to next level
 * - Stats grid: Verifications, Reports, Accuracy (with daily/weekly change)
 * - Share Guardian Profile gradient button
 * - Back outline button
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';

// Derive mock values deterministically from score
function deriveStats(score = 0) {
  const totalXp = Math.max(score, 100);
  const levelThreshold = 2000;
  const currentLevel = Math.max(1, Math.floor(totalXp / levelThreshold));
  const xpIntoLevel = totalXp % levelThreshold;
  const xpForNext = levelThreshold;
  const xpRemaining = Math.max(0, xpForNext - xpIntoLevel);
  const progress = Math.min(1, xpIntoLevel / xpForNext);

  const verifications = Math.max(1, Math.floor(totalXp / 1500));
  const reports = Math.max(0, Math.floor(totalXp / 5000));
  const accuracy = Math.min(100, Math.floor((totalXp % 10000) / 100) || 14);
  const todayDelta = Math.min(999, Math.floor((totalXp % 500) + 20));

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    xpIntoLevel,
    xpForNext,
    xpRemaining,
    progress,
    verifications,
    reports,
    accuracy,
    todayDelta,
  };
}

export default function ChampionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont, moderateScale } = useResponsive();

  const { user = {}, rank = 1, scope = 'Daily' } = route.params || {};

  const {
    currentLevel,
    nextLevel,
    xpIntoLevel,
    xpForNext,
    xpRemaining,
    progress,
    verifications,
    reports,
    accuracy,
    todayDelta,
  } = deriveStats(user.score);

  const avatarSource =
    typeof user.avatar === 'number'
      ? user.avatar
      : typeof user.avatar === 'string'
      ? { uri: user.avatar }
      : user.avatar;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🛡️ ${user.name || 'Insightify Guardian'} is #${rank} on the ${scope} Insightify Leaderboard with ${(user.score || 0).toLocaleString()} points!`,
      });
    } catch (e) {
      // User cancelled
    }
  };

  const bottomScrollPadding = (insets.bottom || 0) + 85;

  const isRankOne = rank === 1;
  const rankMedal = isRankOne ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  // Stat sub-labels
  const verificationSubVal = `+${Math.min(todayDelta, 5)} today`;
  const reportSub = '+0 today';
  const accuracySub = '+2% this week';

  const statIconBgBlue = isDark ? '#1E2D4A' : '#EEF4FF';
  const statIconBgOrange = isDark ? '#2A1A0E' : '#FFF3E0';
  const statIconBgGreen = isDark ? '#0E2A1A' : '#E8F5E9';

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* ── Top Bar ── */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.iconBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={21} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.7}
          style={[styles.iconBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
          accessibilityRole="button"
          accessibilityLabel="Share profile"
        >
          <Ionicons name="share-social-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Hero Card ── */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        {/* Decorative background shield watermark */}
        <View style={styles.shieldWatermark} pointerEvents="none">
          <Ionicons name="shield-checkmark-outline" size={90} color={isDark ? '#1E2D4A' : '#EEF4FF'} />
        </View>

        {/* Rank #1 Crown Badge (top-right corner) — only shown if rank === 1 */}
        {isRankOne && (
          <View style={styles.crownBadge}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
        )}

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.border }]}>
              <Text style={[styles.avatarInitial, { color: colors.textPrimary }]}>
                {(user.name || 'U').charAt(0)}
              </Text>
            </View>
          )}

          {/* Star badge overlapping bottom of avatar */}
          <View style={[styles.starBadge, { backgroundColor: '#4F46E5' }]}>
            <Ionicons name="star" size={11} color="#FFFFFF" />
          </View>
        </View>

        {/* Name */}
        <Text
          numberOfLines={1}
          style={[
            typography.h1,
            styles.name,
            { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) },
          ]}
        >
          {user.name || 'Guardian'}
        </Text>

        {/* Scope · Rank line (medal emoji for rank 2/3, no medal for others) */}
        <View style={styles.rankRow}>
          <Text style={[typography.caption, styles.rankText, { color: colors.textSecondary, fontSize: scaleFont(13, 0.3) }]}>
            {scope} · Rank #{rank}
          </Text>
          {rankMedal && !isRankOne && (
            <Text style={styles.rankMedalEmoji}>{rankMedal}</Text>
          )}
        </View>

        {/* Awareness Points Row */}
        <View
          style={[
            styles.pointsRow,
            {
              backgroundColor: isDark ? '#0D1829' : '#F5F7FF',
              borderRadius: radii.large,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Left: icon + value */}
          <View style={[styles.pointsIconBox, { backgroundColor: isDark ? '#1E2D4A' : '#EEF4FF', borderRadius: moderateScale(10) }]}>
            <Ionicons name="star" size={18} color="#4F46E5" />
          </View>

          <View style={styles.pointsCenter}>
            <Text
              style={[
                styles.pointsValue,
                { color: '#4F46E5', fontSize: scaleFont(22, 0.3) },
              ]}
            >
              {(user.score || 0).toLocaleString()}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
              Awareness Points
            </Text>
          </View>

          {/* Right: today delta */}
          <View style={styles.pointsDelta}>
            <View style={styles.deltaRow}>
              <Ionicons name="arrow-up" size={12} color="#10B981" />
              <Text style={[styles.deltaText, { color: '#10B981', fontSize: scaleFont(13, 0.3) }]}>
                +{todayDelta}
              </Text>
            </View>
            <Text style={[typography.caption, { color: colors.textSecondary, fontSize: scaleFont(11, 0.3) }]}>
              Today
            </Text>
          </View>
        </View>

        {/* Modern Progress Section */}
        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: isDark ? '#0D1829' : '#F5F7FF',
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          {/* Row: label + current level pill */}
          <View style={styles.progressTopRow}>
            <Text
              style={[
                styles.progressToLabel,
                { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
              ]}
            >
              Progress to Level {nextLevel}
            </Text>

            <View style={[styles.levelPill, { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF', borderRadius: radii.pill }]}>
              <Text style={[styles.levelPillText, { color: isDark ? '#A5B4FC' : '#4F46E5', fontSize: scaleFont(11, 0.3) }]}>
                Level {currentLevel}
              </Text>
            </View>
          </View>

          {/* Progress Track with floating star thumb */}
          <View style={styles.progressTrackWrap}>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1E2D4A' : '#E2E8F0' }]}>
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]}
              />
            </View>
            {/* Thumb indicator */}
            <View
              style={[
                styles.progressThumb,
                {
                  left: `${Math.max(0, Math.min(90, Math.round(progress * 100) - 4))}%`,
                  backgroundColor: '#F59E0B',
                },
              ]}
            >
              <Ionicons name="star" size={10} color="#FFFFFF" />
            </View>
          </View>

          {/* Bottom row: XP info */}
          <View style={styles.progressBottomRow}>
            <Text style={[styles.xpCurrentLabel, { color: '#4F46E5', fontSize: scaleFont(12, 0.3) }]}>
              {xpIntoLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP
            </Text>
            <Text style={[styles.xpRemainingLabel, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
              {xpRemaining.toLocaleString()} XP to Level {nextLevel}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Stats Grid ── */}
      <View style={styles.statsGrid}>
        {/* Verifications */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <View style={[styles.statIconBox, { backgroundColor: statIconBgBlue, borderRadius: moderateScale(20) }]}>
            <Ionicons name="checkmark-circle" size={22} color="#4F46E5" />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) }]}>
            {verifications}
          </Text>
          <Text style={[typography.caption, styles.statLabel, { color: colors.textSecondary }]}>
            Verifications
          </Text>
          <View style={styles.statSubRow}>
            <Ionicons name="arrow-up" size={10} color="#10B981" />
            <Text style={[styles.statSub, { color: '#10B981', fontSize: scaleFont(10.5, 0.3) }]}>
              {verificationSubVal}
            </Text>
          </View>
        </View>

        {/* Reports */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <View style={[styles.statIconBox, { backgroundColor: statIconBgOrange, borderRadius: moderateScale(20) }]}>
            <Ionicons name="document-text" size={22} color="#EA580C" />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) }]}>
            {reports}
          </Text>
          <Text style={[typography.caption, styles.statLabel, { color: colors.textSecondary }]}>
            Reports
          </Text>
          <Text style={[styles.statSub, { color: colors.textTertiary, fontSize: scaleFont(10.5, 0.3) }]}>
            {reportSub}
          </Text>
        </View>

        {/* Accuracy */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <View style={[styles.statIconBox, { backgroundColor: statIconBgGreen, borderRadius: moderateScale(20) }]}>
            <Ionicons name="locate" size={22} color="#10B981" />
          </View>
          <Text style={[styles.statValue, { color: '#10B981', fontSize: scaleFont(20, 0.3) }]}>
            {accuracy}%
          </Text>
          <Text style={[typography.caption, styles.statLabel, { color: colors.textSecondary }]}>
            Accuracy
          </Text>
          <View style={styles.statSubRow}>
            <Ionicons name="arrow-up" size={10} color="#10B981" />
            <Text style={[styles.statSub, { color: '#10B981', fontSize: scaleFont(10.5, 0.3) }]}>
              {accuracySub}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Share Guardian Profile Button (gradient) ── */}
      <TouchableOpacity
        onPress={handleShare}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Share Guardian Profile"
        style={styles.shareGradientWrap}
      >
        <LinearGradient
          colors={['#3B82F6', '#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.shareGradientBtn, { borderRadius: radii.large }]}
        >
          <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" style={styles.shareBtnIcon} />
          <Text style={[styles.shareBtnText, { fontSize: scaleFont(15, 0.3) }]}>
            Share Guardian Profile
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ── Back Button (outline) ── */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        style={[
          styles.backOutlineBtn,
          {
            borderColor: isDark ? '#334155' : '#CBD5E1',
            borderRadius: radii.large,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={16} color={isDark ? '#94A3B8' : '#64748B'} style={styles.backBtnIcon} />
        <Text style={[styles.backBtnText, { color: isDark ? '#94A3B8' : '#64748B', fontSize: scaleFont(14.5, 0.3) }]}>
          Back
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 2,
  },

  // Top bar
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero card
  heroCard: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  shieldWatermark: {
    position: 'absolute',
    right: -10,
    top: '15%',
    opacity: 0.4,
  },

  // Crown badge (rank #1 only)
  crownBadge: {
    position: 'absolute',
    top: -6,
    right: 18,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FACC15',
    elevation: 2,
    zIndex: 10,
  },
  crownEmoji: {
    fontSize: 18,
  },

  // Avatar
  avatarWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#2563EB',
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2563EB',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '800',
  },
  starBadge: {
    position: 'absolute',
    bottom: -1,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
  },

  // Name + rank
  name: {
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 4,
  },
  rankText: {
    fontWeight: '500',
  },
  rankMedalEmoji: {
    fontSize: 14,
  },

  // Points row
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  pointsIconBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pointsCenter: {
    flex: 1,
  },
  pointsValue: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  pointsDelta: {
    alignItems: 'flex-end',
  },
  deltaText: {
    fontWeight: '800',
  },

  // Progress card
  progressCard: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressToLabel: {
    fontWeight: '700',
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  levelPillText: {
    fontWeight: '700',
  },
  progressTrackWrap: {
    width: '100%',
    height: 18,
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'absolute',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    top: -2,
  },
  progressBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpCurrentLabel: {
    fontWeight: '700',
  },
  xpRemainingLabel: {
    fontWeight: '500',
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  statIconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 3,
  },
  statSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statSub: {
    fontWeight: '600',
    textAlign: 'center',
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  // Share Guardian Profile (gradient)
  shareGradientWrap: {
    width: '100%',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  shareGradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  shareBtnIcon: {
    marginRight: 8,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Back outline button
  backOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  backBtnIcon: {
    marginRight: 6,
  },
  backBtnText: {
    fontWeight: '700',
  },
});
