/**
 * Insightify — ProtectionStatusCard (Component)
 *
 * Primary emotional anchor hero card on the Home Dashboard:
 * "You're Protected 🟢", "Real-time protection is ON", "We're watching for threats 24/7",
 * with the 3D glowing shield illustration (assets/home/protection-status.png).
 * Fully responsive across all Android device widths (prevents truncation).
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.2
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const HERO_IMAGE = require('../../../../assets/home/protection-status.png');

export default function ProtectionStatusCard({
  isProtected = true,
  style,
}) {
  const { typography, isDark } = useTheme();
  const { width, scaleFont, isSmallDevice } = useResponsive();

  const gradientColors = isDark
    ? ['#1D4ED8', '#0F2E5E']
    : ['#2563EB', '#4F8DFF'];

  // Calculate responsive image size
  const heroSize = Math.min(Math.round(width * 0.32), 130);

  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cardGradient, { paddingHorizontal: isSmallDevice ? 16 : 20 }]}
      >
        {/* Left: Text Column */}
        <View style={styles.textColumn}>
          {/* Status Header + Live Dot (Responsive & Non-Truncating) */}
          <View style={styles.statusHeaderRow}>
            <Text
              style={[
                typography.h2,
                styles.statusTitle,
                { fontSize: scaleFont(isSmallDevice ? 17 : 19, 0.4) },
              ]}
            >
              You’re Protected
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isProtected ? '#20B86B' : '#EF4444' },
              ]}
            />
          </View>

          {/* Primary Subtitle */}
          <Text
            style={[
              typography.body,
              styles.subtitle,
              { fontSize: scaleFont(isSmallDevice ? 13 : 14, 0.3) },
            ]}
          >
            {isProtected ? 'Real-time protection is ON' : 'Protection is Paused'}
          </Text>

          {/* Secondary Subtitle */}
          <Text
            style={[
              typography.bodySmall,
              styles.secondaryText,
              { fontSize: scaleFont(isSmallDevice ? 11.5 : 12, 0.3) },
            ]}
          >
            We're watching for threats 24/7
          </Text>
        </View>

        {/* Right: Proportional 3D Shield Hero Image */}
        <View style={[styles.imageWrapper, { width: heroSize, height: heroSize }]}>
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderRadius: 22,
    minHeight: 155,
  },
  textColumn: {
    flex: 1.25,
    paddingRight: 6,
    justifyContent: 'center',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginBottom: 8,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginRight: 6,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  subtitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryText: {
    color: 'rgba(255, 255, 255, 0.88)',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});
