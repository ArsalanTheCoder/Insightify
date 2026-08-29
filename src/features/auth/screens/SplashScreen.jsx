/**
 * Insightify — Splash Screen (Screen 1)
 *
 * Bootstraps initial state, checks onboarding & auth status, and renders
 * the prominent 3D brand logo with animated gradient progress bar.
 * Responsive across all device dimensions.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useOnboardingStore } from '../../onboarding/store/onboardingStore';
import ScreenContainer from '../../../shared/components/ScreenContainer';

const LOGO_IMAGE = require('../../../../assets/images/Insightify_logo.png');

export default function SplashScreen({ onFinish }) {
  const { colors, typography, gradients } = useTheme();
  const { width, scaleFont } = useResponsive();
  const checkOnboardingStatus = useOnboardingStore((state) => state.checkOnboardingStatus);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const logoSize = Math.min(Math.round(width * 0.45), 180);
  const progressTrackWidth = Math.min(Math.round(width * 0.38), 160);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: false,
    }).start();

    // Check onboarding & session state
    const timer = setTimeout(async () => {
      await checkOnboardingStatus();
      if (onFinish) {
        onFinish();
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [checkOnboardingStatus, onFinish, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, progressTrackWidth],
  });

  return (
    <ScreenContainer withPadding={true} style={styles.container}>
      <View style={styles.centerContent}>
        {/* Responsive Prominent 3D Shield Brand Logo */}
        <View style={[styles.logoWrapper, { width: logoSize, height: logoSize }]}>
          <Image
            source={LOGO_IMAGE}
            style={styles.logo}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>

        {/* Brand Name */}
        <Text style={[typography.display, styles.title, { fontSize: scaleFont(32, 0.3) }]}>
          <Text style={{ color: colors.textPrimary }}>Insight</Text>
          <Text style={{ color: colors.primary }}>ify</Text>
        </Text>

        {/* Subtitle & Tagline */}
        <Text
          style={[
            typography.bodyLarge,
            styles.subtitle,
            { color: colors.textSecondary, fontSize: scaleFont(15, 0.3) },
          ]}
        >
          AI-Powered Scam Detection
        </Text>
        <Text
          style={[
            typography.bodySmall,
            styles.tagline,
            { color: colors.textTertiary, fontSize: scaleFont(13, 0.3) },
          ]}
        >
          Stay <Text style={[styles.boldHighlight, { color: colors.primary }]}>Alert</Text>. Stay Safe.
        </Text>
      </View>

      {/* Bottom Progress Bar */}
      <View style={styles.bottomArea}>
        <View
          style={[
            styles.progressTrack,
            { width: progressTrackWidth, backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Animated.View style={[styles.progressWrapper, { width: progressWidth }]}>
            <LinearGradient
              colors={gradients.primaryCta.colors}
              start={gradients.primaryCta.start}
              end={gradients.primaryCta.end}
              style={styles.progressBar}
            />
          </Animated.View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    letterSpacing: 0.5,
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '500',
  },
  tagline: {
    textAlign: 'center',
  },
  boldHighlight: {
    fontWeight: '600',
  },
  bottomArea: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressWrapper: {
    height: '100%',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
});
