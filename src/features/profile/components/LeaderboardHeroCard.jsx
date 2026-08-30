/**
 * Insightify — LeaderboardHeroCard (Component)
 *
 * Top #1 Ranked Champion podium hero card on LeaderboardScreen.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function LeaderboardHeroCard({
  topGuardian,
  scope = 'Global',
  style,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  if (!topGuardian) {
    return null;
  }

  const avatarSource =
    typeof topGuardian.avatar === 'number'
      ? topGuardian.avatar
      : typeof topGuardian.avatar === 'string'
      ? { uri: topGuardian.avatar }
      : topGuardian.avatar;

  return (
    <View
      style={[
        styles.hero,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      {/* Crown */}
      <View style={styles.crownWrap}>
        <Text style={styles.crown}>👑</Text>
      </View>

      {/* Avatar */}
      <Image source={avatarSource} style={styles.heroAvatar} resizeMode="cover" />

      {/* Name */}
      <Text style={[typography.h2, styles.heroName, { color: colors.textPrimary, fontSize: scaleFont(18, 0.3) }]}>
        {topGuardian.name}
      </Text>

      {/* Score */}
      <Text style={[typography.body, styles.heroScore, { color: colors.primary, fontSize: scaleFont(14, 0.3) }]}>
        {(topGuardian.score || 0).toLocaleString()} pts
      </Text>

      {/* Location Meta */}
      <Text style={[typography.caption, styles.heroMeta, { color: colors.textSecondary }]}>
        {scope === 'Local'
          ? `📍 ${topGuardian.city || 'Pakistan'}`
          : `🌍 ${topGuardian.country || 'Global'}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    position: 'relative',
  },
  crownWrap: {
    position: 'absolute',
    top: -12,
    right: 24,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FACC15',
    elevation: 2,
  },
  crown: {
    fontSize: 16,
  },
  heroAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: '#FACC15',
    marginBottom: 8,
  },
  heroName: {
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
  },
  heroScore: {
    fontWeight: '700',
    marginBottom: 2,
  },
  heroMeta: {
    fontWeight: '500',
  },
});
