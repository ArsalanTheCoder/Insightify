/**
 * Insightify — ThreatCard (Component)
 *
 * Threat incident card matching the approved Feed UI reference:
 * - Left: 3D category illustration badge with risk indicator
 * - Center: Severity badge, title, snippet, metadata tags (platform, location), report count & time
 * - Right: Bookmark button + Evidence screenshot thumbnail preview
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ThreatCard({
  threat,
  onPress,
  onBookmarkToggle,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const isHighRisk = threat.riskLevel === 'HIGH';
  const isMediumRisk = threat.riskLevel === 'MEDIUM';

  const riskBg = isHighRisk
    ? (isDark ? '#3E1616' : '#FEE2E2')
    : isMediumRisk
    ? (isDark ? '#3D2808' : '#FEF3C7')
    : (isDark ? '#0E2442' : '#E0F2FE');

  const riskText = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#0284C7';

  const riskIcon = isHighRisk
    ? 'alert-circle'
    : isMediumRisk
    ? 'warning'
    : 'information-circle';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress && onPress(threat)}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${threat.riskLevel} risk threat: ${threat.title}`}
    >
      {/* Left 3D Category Icon Box */}
      <View style={[styles.categoryIconBox, { backgroundColor: riskBg, borderColor: colors.border }]}>
        <Image
          source={threat.heroAsset}
          style={styles.categoryImage}
          resizeMode="contain"
          fadeDuration={0}
        />
        {/* Small Exclamation Alert Dot */}
        <View style={[styles.alertDot, { backgroundColor: riskText }]}>
          <Text style={styles.alertDotText}>!</Text>
        </View>
      </View>

      {/* Main Content Column */}
      <View style={styles.centerCol}>
        {/* Severity Badge */}
        <View style={[styles.riskBadge, { backgroundColor: riskBg }]}>
          <Ionicons name={riskIcon} size={11} color={riskText} style={styles.riskIcon} />
          <Text style={[styles.riskText, { color: riskText }]}>
            {threat.riskLevel} RISK
          </Text>
        </View>

        {/* Title */}
        <Text
          numberOfLines={2}
          style={[
            typography.h3,
            styles.title,
            { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
          ]}
        >
          {threat.title}
        </Text>

        {/* Description */}
        <Text
          numberOfLines={2}
          style={[
            typography.bodySmall,
            styles.description,
            { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
          ]}
        >
          {threat.description}
        </Text>

        {/* Metadata Badges Row */}
        <View style={styles.tagRow}>
          {threat.platformTag ? (
            <View style={[styles.tagPill, { backgroundColor: isDark ? '#102038' : '#F1F5FB', borderColor: colors.border }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {threat.platformTag}
              </Text>
            </View>
          ) : null}

          {threat.location ? (
            <View style={[styles.tagPill, { backgroundColor: isDark ? '#102038' : '#F1F5FB', borderColor: colors.border }]}>
              <Ionicons name="location-outline" size={11} color={colors.textTertiary} style={{ marginRight: 2 }} />
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {threat.location}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Footer: Report count & Timestamp */}
        <View style={styles.footerRow}>
          <Ionicons name="people-outline" size={12} color={colors.textTertiary} style={{ marginRight: 3 }} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {threat.reportCount} reports  •  {threat.timeAgo}
          </Text>
        </View>
      </View>

      {/* Right Column: Bookmark + Thumbnail Preview */}
      <View style={styles.rightCol}>
        {/* Bookmark Button */}
        <TouchableOpacity
          onPress={() => onBookmarkToggle && onBookmarkToggle(threat.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.bookmarkBtn}
          accessibilityRole="button"
          accessibilityLabel={threat.isBookmarked ? 'Remove bookmark' : 'Bookmark threat'}
        >
          <Ionicons
            name={threat.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={19}
            color={threat.isBookmarked ? colors.primary : colors.textTertiary}
          />
        </TouchableOpacity>

        {/* Evidence Thumbnail Preview */}
        {threat.heroAsset ? (
          <View style={[styles.thumbnailWrapper, { borderColor: colors.border, backgroundColor: colors.surfaceSecondary }]}>
            <Image
              source={threat.heroAsset}
              style={styles.thumbnailImage}
              resizeMode="cover"
              fadeDuration={0}
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  categoryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  categoryImage: {
    width: 32,
    height: 32,
  },
  alertDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  alertDotText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    lineHeight: 10,
  },
  centerCol: {
    flex: 1,
    paddingRight: 8,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    marginBottom: 5,
  },
  riskIcon: {
    marginRight: 3,
  },
  riskText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  title: {
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 3,
  },
  description: {
    lineHeight: 16,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 90,
  },
  bookmarkBtn: {
    padding: 2,
    marginBottom: 10,
  },
  thumbnailWrapper: {
    width: 58,
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
