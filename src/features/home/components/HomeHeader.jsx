/**
 * Insightify — HomeHeader (Component)
 *
 * Top application header on the Home Dashboard:
 * Left: Official Insightify shield logo + "Insightify" + "Stay Alert. Stay Safe."
 * Right: Notification bell with unread badge counter.
 * Responsive across all device dimensions.
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.1
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

const LOGO_IMAGE = require('../../../../assets/images/Insightify_logo.png');

export default function HomeHeader({
  unreadCount = 0,
  onNotificationPress,
  style,
}) {
  const { colors, typography } = useTheme();
  const { moderateScale, scaleFont } = useResponsive();

  const logoSize = moderateScale(44, 0.4);

  return (
    <View style={[styles.container, style]}>
      {/* Left: Official Brand Lockup */}
      <View style={styles.brandRow}>
        <Image
          source={LOGO_IMAGE}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
          fadeDuration={0}
        />
        <View style={styles.brandTextCol}>
          <Text style={[typography.h2, styles.brandTitle, { fontSize: scaleFont(22, 0.3) }]}>
            <Text style={{ color: colors.textPrimary }}>Insight</Text>
            <Text style={{ color: colors.primary }}>ify</Text>
          </Text>
          <Text
            style={[
              typography.caption,
              styles.tagline,
              { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
            ]}
          >
            Stay Alert. Stay Safe.
          </Text>
        </View>
      </View>

      {/* Right: Notification Bell Action */}
      <TouchableOpacity
        onPress={onNotificationPress}
        activeOpacity={0.7}
        style={styles.notificationBtn}
        accessibilityRole="button"
        accessibilityLabel={`Notifications, ${unreadCount} unread`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="notifications-outline"
          size={moderateScale(24, 0.3)}
          color={colors.textPrimary}
        />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
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
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  logo: {
    marginRight: 10,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagline: {
    marginTop: 1,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});
