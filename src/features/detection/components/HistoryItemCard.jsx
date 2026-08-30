/**
 * Insightify — HistoryItemCard (Component)
 *
 * History list item on Scan History screen:
 * Multimodal icon box, title, snippet preview, severity badge, timestamp, and chevron.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 6
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

export default function HistoryItemCard({ item, onPress, style }) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const isHighRisk = item.riskLevel === 'HIGH';
  const isMediumRisk = item.riskLevel === 'MEDIUM';

  const riskBg = isHighRisk
    ? (isDark ? '#3E1616' : '#FEE2E2')
    : isMediumRisk
    ? (isDark ? '#3D2808' : '#FEF3C7')
    : (isDark ? '#102C1E' : '#E8F8F0');

  const riskText = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#10B981';

  const riskLabel = isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Safe';

  // Multimodal icon config
  const typeIcons = {
    text: { name: 'chatbox-ellipses', color: '#0284C7', bgLight: '#EBF5FF', bgDark: '#102038' },
    email: { name: 'mail', color: '#7C3AED', bgLight: '#F3F0FF', bgDark: '#1A1528' },
    image: { name: 'image', color: '#059669', bgLight: '#E8F8F0', bgDark: '#102C1E' },
    video: { name: 'videocam', color: '#E11D48', bgLight: '#FFF0F0', bgDark: '#2D1010' },
    audio: { name: 'mic', color: '#EA580C', bgLight: '#FFF4EB', bgDark: '#2D1E10' },
  };

  const iconConfig = typeIcons[item.type] || typeIcons.text;
  const iconBg = isDark ? iconConfig.bgDark : iconConfig.bgLight;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress && onPress(item)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${riskLabel}, scanned at ${item.timeAgo}`}
    >
      {/* Left Multimodal Icon Box */}
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={iconConfig.name} size={18} color={iconConfig.color} />
      </View>

      {/* Center Text Column */}
      <View style={styles.centerCol}>
        <Text
          numberOfLines={1}
          style={[
            typography.h3,
            styles.title,
            { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            typography.caption,
            styles.snippet,
            { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
          ]}
        >
          {item.snippet}
        </Text>
      </View>

      {/* Right Column: Risk Pill + Time + Chevron */}
      <View style={styles.rightCol}>
        <View style={styles.badgeRow}>
          <View style={[styles.riskBadge, { backgroundColor: riskBg, borderRadius: radii.pill }]}>
            <Text style={[styles.riskBadgeText, { color: riskText }]}>
              {riskLabel}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 4 }} />
        </View>

        <Text style={[styles.timeText, { color: colors.textTertiary }]}>
          {item.timeAgo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  centerCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  snippet: {
    lineHeight: 16,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
  },
  riskBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
