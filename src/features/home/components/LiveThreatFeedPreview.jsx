/**
 * Insightify — LiveThreatFeedPreview (Component)
 *
 * Renders the top real-time threat alerts with "See All" navigation link
 * and fallback states for loading, empty, and errors.
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.5
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import ThreatPreviewCard from './ThreatPreviewCard';
import Skeleton from '../../../shared/components/Skeleton';

export default function LiveThreatFeedPreview({
  threats = [],
  isLoading = false,
  onSeeAllPress,
  onThreatPress,
  style,
}) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Section Header Row */}
      <View style={styles.headerRow}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          Live Threat Feed
        </Text>
        <TouchableOpacity
          onPress={onSeeAllPress}
          activeOpacity={0.7}
          style={styles.seeAllBtn}
          accessibilityRole="button"
          accessibilityLabel="See all threats"
        >
          <Text style={[typography.label, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading Skeleton */}
      {isLoading && threats.length === 0 ? (
        <View style={styles.skeletonContainer}>
          <Skeleton height={110} style={{ marginBottom: 12 }} />
          <Skeleton height={110} />
        </View>
      ) : threats.length === 0 ? (
        /* Empty State */
        <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
            No active threats reported in your area. You're safe!
          </Text>
        </View>
      ) : (
        /* Threat List */
        threats.map((item) => (
          <ThreatPreviewCard
            key={item.id}
            threat={item}
            onPress={onThreatPress}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  skeletonContainer: {
    width: '100%',
  },
  emptyCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
