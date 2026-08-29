/**
 * Insightify — HomeScreen (Feature Screen)
 *
 * Implements the approved Home Dashboard UI reference matching RFC-002-F:
 * - Brand Header with Notification badge
 * - Protection Status hero card ("You're Protected 🟢")
 * - Protection Summary with 4 compact equal-height metric cards
 * - 5 Quick Action launchpad tiles
 * - Live Threat Feed preview with "See All"
 * - Daily Safety Tip card linking to Learn
 * Fully responsive and Safe-Area aware across all Android & iOS devices.
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5
 */

import React from 'react';
import {
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useHomeDashboard } from '../hooks/useHomeDashboard';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import HomeHeader from '../components/HomeHeader';
import ProtectionStatusCard from '../components/ProtectionStatusCard';
import ProtectionSummaryGrid from '../components/ProtectionSummaryGrid';
import QuickActionTiles from '../components/QuickActionTiles';
import LiveThreatFeedPreview from '../components/LiveThreatFeedPreview';
import DailySafetyTipCard from '../components/DailySafetyTipCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    summary,
    threatFeed,
    dailyTip,
    unreadNotifications,
    isLoading,
    isRefreshing,
    handleRefresh,
    timeframe,
    setTimeframe,
  } = useHomeDashboard();

  // Navigation Handlers
  const handleNotificationPress = () => {
    Alert.alert(
      'Security Notifications',
      `You have ${unreadNotifications} unread scam alerts in your area.`,
      [{ text: 'OK' }]
    );
  };

  const handleTimeframePress = () => {
    Alert.alert(
      'Select Summary Timeframe',
      'Choose the telemetry aggregation window:',
      [
        { text: 'This Week', onPress: () => setTimeframe('this_week') },
        { text: 'This Month', onPress: () => setTimeframe('this_month') },
        { text: 'All Time', onPress: () => setTimeframe('all_time') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleQuickAction = (mode) => {
    navigation.navigate('Detect', { initialMode: mode });
  };

  const handleSeeAllThreats = () => {
    navigation.navigate('Feed');
  };

  const handleThreatPress = (threat) => {
    navigation.navigate('Feed', {
      screen: 'FeedDetail',
      params: { threatId: threat.id, threat },
    });
  };

  const handleLearnPress = () => {
    navigation.navigate('Learn');
  };

  // Safe bottom scroll padding so the bottom-most card is fully visible above the floating bar
  const bottomScrollPadding = (insets.bottom || 8) + 95;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* 1. Top Brand Header */}
      <HomeHeader
        unreadCount={unreadNotifications}
        onNotificationPress={handleNotificationPress}
      />

      {/* 2. Protection Status Hero Card */}
      <ProtectionStatusCard
        isProtected={summary?.isProtected ?? true}
      />

      {/* 3. Protection Summary (4 Metric Cards) */}
      <ProtectionSummaryGrid
        summary={summary}
        timeframe={timeframe === 'this_week' ? 'This Week' : timeframe === 'this_month' ? 'This Month' : 'All Time'}
        onTimeframePress={handleTimeframePress}
      />

      {/* 4. Quick Actions (5 Multimodal Entrypoints) */}
      <QuickActionTiles
        onActionPress={handleQuickAction}
      />

      {/* 5. Live Threat Feed Preview */}
      <LiveThreatFeedPreview
        threats={threatFeed}
        isLoading={isLoading}
        onSeeAllPress={handleSeeAllThreats}
        onThreatPress={handleThreatPress}
      />

      {/* 6. Daily Safety Tip Card */}
      <DailySafetyTipCard
        tip={dailyTip}
        onPress={handleLearnPress}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 6,
  },
});
