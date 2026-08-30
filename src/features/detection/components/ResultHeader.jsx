/**
 * Insightify — ResultHeader (Component)
 *
 * Top action bar on Scan Result screen:
 * Left: Back button + "Scan Result" title
 * Right: Bookmark save toggle + Share action button.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 7
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ResultHeader({
  onBack,
  isBookmarked = false,
  onBookmarkToggle,
  onShare,
  style,
}) {
  const { colors, typography } = useTheme();
  const { scaleFont } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      {/* Left: Back Arrow + Title */}
      <View style={styles.leftRow}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) }]}>
          Scan Result
        </Text>
      </View>

      {/* Right: Bookmark + Share Actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={onBookmarkToggle}
          activeOpacity={0.7}
          style={styles.actionBtn}
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark result'}
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
          accessibilityLabel="Share scan result"
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
    marginBottom: 16,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontWeight: '800',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
