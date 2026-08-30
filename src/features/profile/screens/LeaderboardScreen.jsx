/**
 * Insightify — LeaderboardScreen (Feature Screen)
 *
 * Dedicated Leaderboard Screen:
 * - Header with back button & centered title
 * - 3 Period Filters: Daily | Monthly | All Time
 * - Top 3 Podium (crown on #1 only, #2/#3 on sides)
 * - Modern table header: Rank | Player | Points
 * - Ranked player list (Ranks 4+) with modern row cards
 * - Bottom Encouragement Banner
 *
 * Spacing is compact and consistent throughout.
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useLeaderboard } from '../hooks/useLeaderboard';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LeaderboardPodium from '../components/LeaderboardPodium';
import LeaderboardRowItem from '../components/LeaderboardRowItem';
import LeaderboardEncouragementBanner from '../components/LeaderboardEncouragementBanner';

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const { colors, typography, radii, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const {
    period,
    setPeriod,
    periods,
    topThree,
    remainingRankings,
    isLoading,
  } = useLeaderboard('Daily');

  const handlePlayerPress = (player, rank) => {
    navigation.navigate('Champion', {
      user: player,
      rank,
      scope: period,
    });
  };

  const bottomScrollPadding = (insets.bottom || 0) + 85;

  const filterBg = isDark ? '#102038' : '#F1F5F9';
  const tableHeaderBg = isDark ? '#0D1829' : '#F8FAFC';
  const tableHeaderBorderColor = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* ── 1. Header ── */}
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

        <Text
          style={[
            typography.h2,
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) },
          ]}
        >
          Leaderboard
        </Text>

        {/* Spacer to balance header */}
        <View style={styles.headerSpacer} />
      </View>

      {/* ── 2. Period Filter Pills ── */}
      <View
        style={[
          styles.filterSegment,
          { backgroundColor: filterBg, borderRadius: radii.pill },
        ]}
      >
        {periods.map((p) => {
          const isActive = period === p;
          return (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              activeOpacity={0.8}
              style={[
                styles.filterTab,
                isActive && [
                  styles.filterTabActive,
                  { backgroundColor: '#4F46E5', borderRadius: radii.pill },
                ],
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${p} leaderboard`}
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
                {p}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 3. Top 3 Podium ── */}
      {topThree && topThree.length > 0 ? (
        <View
          style={[
            styles.podiumCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <LeaderboardPodium
            topThree={topThree}
            onUserPress={handlePlayerPress}
          />
        </View>
      ) : null}

      {/* ── 4. Table Header ── */}
      <View
        style={[
          styles.tableHeader,
          {
            backgroundColor: tableHeaderBg,
            borderColor: tableHeaderBorderColor,
            borderRadius: radii.medium,
          },
        ]}
      >
        <Text
          style={[
            styles.thRank,
            { color: isDark ? '#64748B' : '#94A3B8', fontSize: scaleFont(11.5, 0.3) },
          ]}
        >
          RANK
        </Text>
        <Text
          style={[
            styles.thPlayer,
            { color: isDark ? '#64748B' : '#94A3B8', fontSize: scaleFont(11.5, 0.3) },
          ]}
        >
          PLAYER
        </Text>
        <View style={styles.thPointsGroup}>
          <Text
            style={[
              styles.thPoints,
              { color: isDark ? '#A5B4FC' : '#4F46E5', fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            POINTS
          </Text>
          <Ionicons
            name="chevron-down"
            size={11}
            color={isDark ? '#A5B4FC' : '#4F46E5'}
          />
        </View>
      </View>

      {/* ── 5. Remaining Ranked Users (Rank 4+) ── */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.listWrap}>
          {remainingRankings.map((item, index) => (
            <LeaderboardRowItem
              key={item.id || index}
              item={item}
              index={index}
              onPress={handlePlayerPress}
            />
          ))}

          {/* ── 6. Encouragement Banner ── */}
          <LeaderboardEncouragementBanner
            onPress={() => navigation.navigate('Achievements')}
          />
        </View>
      )}
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

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 10,
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
  headerSpacer: {
    width: 38,
  },

  // Filter
  filterSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginBottom: 12,
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

  // Podium wrapper card
  podiumCard: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 0,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  // Table header
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 6,
    borderWidth: 1,
  },
  thRank: {
    width: 36,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  thPlayer: {
    flex: 1,
    fontWeight: '700',
    letterSpacing: 0.4,
    paddingLeft: 50,
  },
  thPointsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  thPoints: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // List
  listWrap: {
    paddingBottom: 4,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
