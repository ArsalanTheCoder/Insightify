/**
 * Insightify — DetectHeader (Component)
 *
 * Top header on Detect screen:
 * Left: "Detect" title + "AI-Powered Scam Shield" subtitle
 * Right: "🕒 History" pill action button.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 5
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

export default function DetectHeader({ onHistoryPress, style }) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      {/* Left: Title & Subtitle */}
      <View style={styles.textCol}>
        <Text style={[typography.h1, styles.title, { color: colors.textPrimary, fontSize: scaleFont(26, 0.3) }]}>
          Detect
        </Text>
        <Text style={[typography.caption, styles.subtitle, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
          AI-Powered Scam Shield
        </Text>
      </View>

      {/* Right: History Pill Action */}
      <TouchableOpacity
        onPress={onHistoryPress}
        activeOpacity={0.75}
        style={[
          styles.historyBtn,
          {
            backgroundColor: isDark ? '#102038' : '#EEF4FF',
            borderColor: colors.border,
            borderRadius: radii.pill,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="View scan history"
      >
        <Ionicons
          name="time-outline"
          size={14}
          color={colors.primary}
          style={styles.historyIcon}
        />
        <Text style={[styles.historyText, { color: colors.primary, fontSize: scaleFont(12.5, 0.3) }]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 12,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  historyIcon: {
    marginRight: 5,
  },
  historyText: {
    fontWeight: '700',
  },
});
