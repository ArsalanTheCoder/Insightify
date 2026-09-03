/**
 * Insightify — FeedScreen (Feature Screen)
 *
 * Implements the approved Threat Feed screen matching RFC-003-F:
 * - Brand Header with Notification badge
 * - "Threat Feed" title + Category filter dropdown button
 * - 4 Horizontal segment tabs: For You | Trending | Nearby | Latest
 * - Scrollable list of threat incident cards
 * - Category filter bottom sheet modal
 * - Safe-Area aware and responsive across all devices
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useThreatFeed } from '../hooks/useThreatFeed';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import FeedHeader from '../components/FeedHeader';
import FeedTitleBar from '../components/FeedTitleBar';
import FeedTabs from '../components/FeedTabs';
import ThreatCard from '../components/ThreatCard';
import CategoryFilterModal from '../components/CategoryFilterModal';

export default function FeedScreen() {
  const navigation = useNavigation();
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    threats,
    isLoading,
    isRefreshing,
    handleRefresh,
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    isFilterModalVisible,
    setFilterModalVisible,
    handleToggleBookmark,
  } = useThreatFeed();

  // Navigation Handlers
  const handleNotificationPress = () => {
    Alert.alert(
      'Threat Alerts',
      'You have 3 active threats circulating in your area.',
      [{ text: 'OK' }]
    );
  };

  const handleThreatPress = (threat) => {
    navigation.navigate('FeedDetail', { threatId: threat.id, threat });
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
      {/* 1. Brand Header */}
      <FeedHeader
        unreadCount={3}
        onNotificationPress={handleNotificationPress}
      />

      {/* 2. Feed Title & Category Filter Dropdown */}
      <FeedTitleBar
        selectedCategory={activeCategory}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      {/* 3. Segmented Filter Tabs */}
      <FeedTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 4. Threat Incident Cards List */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 12 }]}>
            Loading latest threat alerts...
          </Text>
        </View>
      ) : threats.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[typography.h3, styles.emptyTitle, { color: colors.textPrimary }]}>
            No threats reported
          </Text>
          <Text style={[typography.bodySmall, styles.emptySubtitle, { color: colors.textSecondary }]}>
            There are currently no active threat reports matching this filter.
          </Text>
        </View>
      ) : (
        <View style={styles.cardsList}>
          {threats.map((threat) => (
            <ThreatCard
              key={threat.id}
              threat={threat}
              onPress={handleThreatPress}
              onBookmarkToggle={handleToggleBookmark}
            />
          ))}
        </View>
      )}

      {/* Category Selection Modal Sheet */}
      <CategoryFilterModal
        visible={isFilterModalVisible}
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onClose={() => setFilterModalVisible(false)}
      />
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
  cardsList: {
    paddingTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
