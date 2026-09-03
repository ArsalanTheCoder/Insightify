/**
 * Insightify — DetailHeader (Component)
 *
 * Top action bar on the Threat Detail screen:
 * Left: Back button
 * Right: Bookmark save toggle + Share action button.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function DetailHeader({
  onBack,
  isBookmarked = false,
  onBookmarkToggle,
  onShare,
  style,
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Left: Back Button */}
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.actionBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Right: Bookmark + Share Actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={onBookmarkToggle}
          activeOpacity={0.7}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark threat'}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? colors.primary : colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          activeOpacity={0.7}
          style={[styles.actionBtn, { marginLeft: 4 }]}
          accessibilityRole="button"
          accessibilityLabel="Share threat alert"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
