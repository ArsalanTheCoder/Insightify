/**
 * Insightify — FeedTitleBar (Component)
 *
 * Screen title ("Threat Feed"), subtitle tagline, and category filter dropdown pill.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 5
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

export default function FeedTitleBar({
  selectedCategory = 'all',
  onFilterPress,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();

  const categoryLabels = {
    all: 'All Threats',
    banking: 'Banking',
    phishing: 'Phishing',
    'voice ai': 'Voice AI',
    deepfake: 'Deepfake',
    fraud: 'Job & Fraud',
  };

  const displayCategory = categoryLabels[selectedCategory.toLowerCase()] || 'All Threats';

  return (
    <View style={[styles.container, style]}>
      {/* Left: Title & Subtitle */}
      <View style={styles.textCol}>
        <Text style={[typography.h1, styles.title, { color: colors.textPrimary, fontSize: scaleFont(26, 0.3) }]}>
          Threat Feed
        </Text>
        <Text style={[typography.caption, styles.subtitle, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
          Real threats. Real people. Real protection.
        </Text>
      </View>

      {/* Right: Category Filter Dropdown Button */}
      <TouchableOpacity
        onPress={onFilterPress}
        activeOpacity={0.75}
        style={[
          styles.filterBtn,
          {
            backgroundColor: isDark ? '#102038' : '#F1F5FB',
            borderColor: colors.border,
            borderRadius: radii.pill,
            paddingHorizontal: isSmallDevice ? 8 : 12,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Filter threats, currently ${displayCategory}`}
      >
        <Ionicons
          name="shield-outline"
          size={14}
          color={colors.primary}
          style={styles.filterIcon}
        />
        <Text
          numberOfLines={1}
          style={[
            typography.caption,
            styles.filterText,
            { color: colors.textPrimary, fontSize: scaleFont(12, 0.3) },
          ]}
        >
          {displayCategory}
        </Text>
        <Ionicons
          name="chevron-down"
          size={12}
          color={colors.textSecondary}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 4,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderWidth: 1,
    paddingVertical: 6,
  },
  filterIcon: {
    marginRight: 5,
  },
  filterText: {
    fontWeight: '600',
    marginRight: 4,
  },
  chevronIcon: {
    marginTop: 1,
  },
});
