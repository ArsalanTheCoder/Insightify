/**
 * Insightify — LeaderboardPreviewCard (Component)
 *
 * Leaderboard section on Profile screen representing the Monthly top 3 performers
 * with podium layout (crown on #1, #2 left, #3 right) and "View Full" action.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import SectionTitle from '../../../shared/components/SectionTitle';
import LeaderboardPodium from './LeaderboardPodium';

export default function LeaderboardPreviewCard({
  topThree = [],
  onViewAll,
  onUserPress,
  style,
}) {
  const { colors, radii } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      <SectionTitle
        title="Leaderboard"
        actionText="View Full"
        onActionPress={onViewAll}
      />

      {/* Card Body with Top 3 Podium */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <LeaderboardPodium
          topThree={topThree}
          onUserPress={onUserPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 0,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
});
