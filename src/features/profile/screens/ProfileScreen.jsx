/**
 * Insightify — ProfileScreen (Feature Screen)
 *
 * Primary Profile Screen — clean, compact, and focused on:
 * Identity + Security Progress + Stats + Leaderboard + Achievements + Account Actions.
 *
 * Layout is compact enough for primary content to be visible within one viewport.
 * Lower sections (Achievements, Actions) remain comfortably scrollable.
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useProfile } from '../hooks/useProfile';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAchievements } from '../hooks/useAchievements';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ProfileHeroCard from '../components/ProfileHeroCard';
import ProfileStatsCard from '../components/ProfileStatsCard';
import LeaderboardPreviewCard from '../components/LeaderboardPreviewCard';
import AchievementsPreviewCard from '../components/AchievementsPreviewCard';
import ProfileActionsCard from '../components/ProfileActionsCard';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors, typography, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const { profile, isLoading: isProfileLoading } = useProfile();
  const { topThree: monthlyTopThree } = useLeaderboard('Monthly');
  const { achievements } = useAchievements('All');

  // Enough padding so content clears the fixed bottom navigation
  const bottomScrollPadding = (insets.bottom || 0) + 80;

  if (isProfileLoading && !profile) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const settingsBgColor = isDark ? '#102038' : '#F1F5F9';

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* Top Header Row with Settings Cog Icon */}
      <View style={styles.headerRow}>
        <Text
          style={[
            typography.h1,
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: scaleFont(24, 0.3) },
          ]}
        >
          Profile
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.75}
          style={[styles.settingsBtn, { backgroundColor: settingsBgColor }]}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
        >
          <Ionicons name="settings-outline" size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* 1. User Hero Card (Avatar, Name, Title, Level Pill, Modern XP Progress) */}
      <ProfileHeroCard profile={profile} />

      {/* 2. Security Stats (Scans, Threats Prevented, Reports) */}
      <ProfileStatsCard
        scans={profile?.scans || 47}
        threatsPrevented={profile?.threatsPrevented || 19}
        reports={profile?.reports || 8}
      />

      {/* 3. Leaderboard Monthly Preview (Top 3 Podium with Crown) */}
      <LeaderboardPreviewCard
        topThree={monthlyTopThree}
        onViewAll={() => navigation.navigate('Leaderboard')}
        onUserPress={(user, rank) => navigation.navigate('Champion', { user, rank, scope: 'Monthly' })}
      />

      {/* 4. Achievements Preview (4 Badges with View All action) */}
      <AchievementsPreviewCard
        achievements={achievements}
        onViewAll={() => navigation.navigate('Achievements')}
      />

      {/* 5. Quick Account Actions (Edit Profile, Settings, Scan History) */}
      <ProfileActionsCard
        onEditProfile={() => navigation.navigate('EditProfile')}
        onSettings={() => navigation.navigate('Settings')}
        onScanHistory={() => navigation.navigate('ScanHistory')}
      />
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 6,
  },
  headerTitle: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
