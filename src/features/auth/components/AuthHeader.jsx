/**
 * Insightify — AuthHeader (Component)
 *
 * Reusable brand lockup for Login & Register screens matching UI references:
 * Top shield badge + "Insightify" brand name + screen title + subtitle.
 * Responsive across all device sizes.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const LOGO_IMAGE = require('../../../../assets/images/Insightify_logo.png');

export default function AuthHeader({ title, subtitle, style }) {
  const { colors, typography, spacing } = useTheme();
  const { moderateScale, scaleFont, isSmallDevice } = useResponsive();

  // Prominently sized responsive brand logo badge
  const logoSize = moderateScale(isSmallDevice ? 86 : 98, 0.4);

  return (
    <View style={[styles.container, style]}>
      {/* Responsive Shield Brand Badge */}
      <View style={[styles.logoWrapper, { width: logoSize, height: logoSize }]}>
        <Image
          source={LOGO_IMAGE}
          style={styles.logo}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* Prominent Brand Name */}
      <Text style={[typography.h2, styles.brandName, { fontSize: scaleFont(21, 0.3) }]}>
        <Text style={{ color: colors.textPrimary }}>Insight</Text>
        <Text style={{ color: colors.primary }}>ify</Text>
      </Text>

      {/* Screen Title */}
      {title ? (
        <Text
          style={[
            typography.h1,
            styles.title,
            { color: colors.textPrimary, marginTop: spacing.xs, fontSize: scaleFont(24, 0.3) },
          ]}
        >
          {title}
        </Text>
      ) : null}

      {/* Subtitle */}
      {subtitle ? (
        <Text
          style={[
            typography.body,
            styles.subtitle,
            { color: colors.textSecondary, marginTop: 4, fontSize: scaleFont(14, 0.3) },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
