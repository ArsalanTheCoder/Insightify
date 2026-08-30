/**
 * Insightify — LeaderboardRowItem (Component)
 *
 * Modern ranked player row for leaderboard list (ranks 4+):
 * - Rank number with subtle colored numbering
 * - Circular avatar (or initials fallback)
 * - Player name + points on separate sub-line
 * - Clean highlight card for current user ("You")
 * - Chevron right for tappability
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

export default function LeaderboardRowItem({
  item,
  index,
  onPress,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, moderateScale } = useResponsive();

  const rankNumber = item.rank || index + 4;
  const isMe = !!item.me;

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

  const avatarSource = normalizeAvatar(item.avatar);

  // Card styling — highlighted for current user
  const cardBg = isMe
    ? isDark ? '#1E1B4B' : '#F5F3FF'
    : colors.surface;

  const cardBorderColor = isMe
    ? '#8B5CF6'
    : colors.border;

  const rankColor = isMe
    ? '#6366F1'
    : isDark ? '#64748B' : '#94A3B8';

  const nameColor = isMe
    ? isDark ? '#A5B4FC' : '#4F46E5'
    : colors.textPrimary;

  const avatarSize = moderateScale(40);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(item, rankNumber)}
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorderColor,
          borderRadius: radii.large,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Rank ${rankNumber}, ${item.name}, ${(item.score || 0).toLocaleString()} points`}
    >
      {/* 1. Rank number */}
      <View style={styles.rankCol}>
        <Text
          style={[
            styles.rankText,
            { color: rankColor, fontSize: scaleFont(13, 0.3) },
          ]}
        >
          {rankNumber}
        </Text>
      </View>

      {/* 2. Avatar */}
      <View style={styles.avatarCol}>
        {avatarSource ? (
          <Image
            source={avatarSource}
            style={[
              styles.avatar,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                borderColor: isMe ? '#8B5CF6' : colors.border,
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
                backgroundColor: isMe
                  ? isDark ? '#2D2770' : '#EDE9FE'
                  : colors.border,
                borderColor: isMe ? '#8B5CF6' : 'transparent',
              },
            ]}
          >
            <Text style={[styles.placeholderText, { color: isMe ? '#6366F1' : colors.textSecondary }]}>
              {(item.name || 'U').charAt(0)}
            </Text>
          </View>
        )}
      </View>

      {/* 3. Name + Points stacked */}
      <View style={styles.infoCol}>
        <Text
          numberOfLines={1}
          style={[
            typography.body,
            styles.nameText,
            {
              color: nameColor,
              fontWeight: isMe ? '800' : '600',
              fontSize: scaleFont(13.5, 0.3),
            },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.pointsSub,
            { color: isDark ? '#6B7280' : '#9CA3AF', fontSize: scaleFont(11.5, 0.3) },
          ]}
        >
          {(item.score || 0).toLocaleString()} pts
        </Text>
      </View>


    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  rankCol: {
    width: 26,
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    fontWeight: '800',
    textAlign: 'center',
  },
  avatarCol: {
    marginRight: 10,
  },
  avatar: {
    borderWidth: 1.5,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  placeholderText: {
    fontWeight: '700',
    fontSize: 14,
  },
  infoCol: {
    flex: 1,
    paddingRight: 6,
  },
  nameText: {
    marginBottom: 1,
  },
  pointsSub: {
    fontWeight: '500',
  },

});
