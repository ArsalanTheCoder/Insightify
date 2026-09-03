/**
 * Insightify — ScanHistoryScreen (Feature Screen)
 *
 * Implements the approved Scan History screen matching RFC-004-F:
 * - History Header with 3D clipboard asset (assets/detect/scan-history.png)
 * - 2 Summary Metric Cards (Analyze Logs / 24 & Threats Detected / 7)
 * - Recent Scans list with dynamic icon, snippet, risk badge, and timestamp
 * - Tap history item -> opens reusable ResultScreen
 * - Safe-Area aware across all Android & iOS devices
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useScanHistory } from '../hooks/useScanHistory';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import HistoryHeader from '../components/HistoryHeader';
import HistoryStatsGrid from '../components/HistoryStatsGrid';
import HistoryItemCard from '../components/HistoryItemCard';

export default function ScanHistoryScreen() {
  const navigation = useNavigation();
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    scans,
    stats,
    isLoading,
    isRefreshing,
    handleRefresh,
  } = useScanHistory();

  const handleItemPress = (item) => {
    navigation.navigate('ScanResult', {
      resultId: item.id,
      resultData: item,
    });
  };

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
      {/* 1. Header with 3D Clipboard Asset */}
      <HistoryHeader onBack={() => navigation.goBack()} />

      {/* 2. Summary Metric Cards (Analyze Logs & Threats Detected) */}
      <HistoryStatsGrid
        totalScans={stats.totalScans}
        totalThreats={stats.totalThreats}
      />

      {/* 3. Recent Scans Section Header */}
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
        Recent Scans
      </Text>

      {/* 4. History List / Loading / Empty */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 12 }]}>
            Loading scan history...
          </Text>
        </View>
      ) : scans.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[typography.h3, styles.emptyTitle, { color: colors.textPrimary }]}>
            No scan history yet
          </Text>
          <Text style={[typography.bodySmall, styles.emptySubtitle, { color: colors.textSecondary }]}>
            Scans performed using the AI Scam Analyzer will appear here.
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {scans.map((item) => (
            <HistoryItemCard
              key={item.id}
              item={item}
              onPress={handleItemPress}
            />
          ))}
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
    paddingTop: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
