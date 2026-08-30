/**
 * Insightify — LeaderboardPodium (Component)
 *
 * Prominent Top 3 performers podium display:
 * - #1 in center with golden crown (👑), larger avatar, and rank 1 badge
 * - #2 on left with rank 2 badge
 * - #3 on right with rank 3 badge
 *
 * Visual reference matching attached approved Leaderboard UI.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function LeaderboardPodium({
  topThree = [],
  onUserPress,
  style,
}) {
  const { colors, typography, isDark } = useTheme();
  const { scaleFont, isSmallDevice, moderateScale } = useResponsive();

  if (!topThree || topThree.length === 0) {
    return null;
  }

  const rank1 = topThree.find((u) => u.rank === 1) || topThree[0];
  const rank2 = topThree.find((u) => u.rank === 2) || topThree[1];
  const rank3 = topThree.find((u) => u.rank === 3) || topThree[2];

  const normalizeAvatar = (avatar) => {
    if (typeof avatar === 'number') {
      return avatar;
    }
    if (typeof avatar === 'string') {
      return { uri: avatar };
    }
    if (typeof avatar === 'object' && avatar?.uri) {
      return avatar;
    }
    return null;
  };

  const centerAvatarSize = isSmallDevice ? moderateScale(74) : moderateScale(88);
  const sideAvatarSize = isSmallDevice ? moderateScale(60) : moderateScale(70);

  const renderPodiumPlayer = (player, rankNumber, avatarSize, isCenter = false) => {
    if (!player) {
      return <View style={styles.podiumCol} />;
    }

    const avatarSource = normalizeAvatar(player.avatar);
    const isMe = !!player.me;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onUserPress && onUserPress(player, rankNumber)}
        style={[styles.podiumCol, isCenter && styles.centerCol]}
        accessibilityRole="button"
        accessibilityLabel={`Rank ${rankNumber}, ${player.name}, ${(player.score || 0).toLocaleString()} points`}
      >
        {/* Crown on #1 only */}
        {isCenter ? (
          <View style={styles.crownWrapper}>
            <Text style={[styles.crownText, { fontSize: isSmallDevice ? 20 : 24 }]}>👑</Text>
          </View>
        ) : (
          <View style={{ height: isSmallDevice ? 20 : 24 }} />
        )}

        {/* Avatar Container with Overlapping Rank Pill */}
        <View style={styles.avatarWrapper}>
          {avatarSource ? (
            <Image
              source={avatarSource}
              style={[
                styles.avatar,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                  borderColor: isCenter ? '#7C3AED' : '#8B5CF6',
                },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                  backgroundColor: colors.border,
                },
              ]}
            >
              <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: isCenter ? 24 : 18 }}>
                {(player.name || 'U').charAt(0)}
              </Text>
            </View>
          )}

          {/* Number Badge Overlapping Bottom Center of Avatar */}
          <View
            style={[
              styles.rankBadge,
              {
                backgroundColor: isCenter ? '#6366F1' : '#8B5CF6',
                borderColor: isDark ? '#061329' : '#FFFFFF',
              },
            ]}
          >
            <Text style={styles.rankBadgeText}>{rankNumber}</Text>
          </View>
        </View>

        {/* Player Name */}
        <Text
          numberOfLines={1}
          style={[
            typography.h3,
            styles.playerName,
            {
              color: colors.textPrimary,
              fontSize: scaleFont(isCenter ? 14.5 : 13, 0.3),
              fontWeight: isMe ? '800' : '700',
            },
          ]}
        >
          {player.name} {isMe ? '(YOU)' : ''}
        </Text>

        {/* Points with Medal Icon */}
        <View style={styles.pointsRow}>
          <Text style={styles.medalEmoji}>🎖️</Text>
          <Text
            style={[
              typography.caption,
              styles.pointsText,
              {
                color: isDark ? '#C7D2FE' : '#4F46E5',
                fontSize: scaleFont(isCenter ? 12 : 11, 0.3),
              },
            ]}
          >
            {(player.score || 0).toLocaleString()} points
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* 2. Rank 2 (Left) */}
      {renderPodiumPlayer(rank2, 2, sideAvatarSize, false)}

      {/* 1. Rank 1 (Center) */}
      {renderPodiumPlayer(rank1, 1, centerAvatarSize, true)}

      {/* 3. Rank 3 (Right) */}
      {renderPodiumPlayer(rank3, 3, sideAvatarSize, false)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 4,
    paddingBottom: 8,
    marginBottom: 4,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  centerCol: {
    flex: 1.2,
    marginBottom: 4,
  },
  crownWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  crownText: {
    textAlign: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatar: {
    borderWidth: 3,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  playerName: {
    textAlign: 'center',
    marginBottom: 2,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalEmoji: {
    fontSize: 11,
    marginRight: 3,
  },
  pointsText: {
    fontWeight: '700',
  },
});
