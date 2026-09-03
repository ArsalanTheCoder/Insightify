/**
 * Insightify — OnboardingSlide (Component)
 *
 * Reusable slide template for all 3 onboarding screens.
 * Strictly implements the approved visual hierarchy from UI references:
 * Top/Skip → Illustration → Heading → Description → Pagination → Next CTA.
 * Fully responsive and Safe-Area aware across all Android & iOS devices.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import Button from '../../../shared/components/Button';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import OnboardingPagination from './OnboardingPagination';

export default function OnboardingSlide({
  imageSource,
  titlePrefix,
  titleHighlight,
  description,
  currentStep = 0,
  totalSteps = 3,
  onNext,
  onSkip,
  ctaTitle = 'Next →',
}) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height, scaleFont, isSmallDevice, isShortDevice } = useResponsive();

  // Responsive illustration bounds preserving aspect ratio
  const maxImageHeight = isShortDevice
    ? Math.min(Math.round(height * 0.38), 280)
    : Math.min(Math.round(height * 0.44), 360);
  const imageWidth = Math.min(Math.round(width * 0.88), 350);

  // Safe area bottom inset to ensure Next CTA is never covered by Android system navigation bar
  const bottomContainerPadding = Math.max(insets.bottom || 0, 16) + 12;

  return (
    <ScreenContainer
      withPadding={true}
      style={[styles.container, { paddingBottom: bottomContainerPadding }]}
    >
      {/* Top Bar: Skip button (increased touch area and font size) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onSkip}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={styles.skipBtn}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text
            style={[
              typography.label,
              styles.skipText,
              { color: colors.textSecondary, fontSize: scaleFont(15, 0.3) },
            ]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Large Responsive Hero Illustration (moved slightly upward) */}
      <View style={[styles.imageWrapper, { maxHeight: maxImageHeight }]}>
        <Image
          source={imageSource}
          style={[styles.image, { width: imageWidth }]}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* 2. Content Block: Heading → Description → Pagination → Next CTA */}
      <View style={styles.contentBlock}>
        {/* Heading directly below illustration */}
        <Text
          style={[
            typography.h1,
            styles.title,
            { fontSize: scaleFont(isSmallDevice ? 24 : 28, 0.3) },
          ]}
        >
          <Text style={{ color: colors.textPrimary }}>{titlePrefix} </Text>
          <Text style={{ color: colors.primary }}>{titleHighlight}</Text>
        </Text>

        {/* Description directly below heading */}
        <Text
          style={[
            typography.body,
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: scaleFont(isSmallDevice ? 13.5 : 15, 0.3),
            },
          ]}
        >
          {description}
        </Text>

        {/* Pagination Dots with small controlled spacing */}
        <OnboardingPagination
          total={totalSteps}
          current={currentStep}
          style={styles.pagination}
        />

        {/* Next CTA Button (safely above Android system navigation) */}
        <Button
          title={ctaTitle}
          onPress={onNext}
          style={styles.ctaButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
    minHeight: 40,
  },
  skipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  skipText: {
    fontWeight: '600',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  image: {
    height: '100%',
  },
  contentBlock: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
    marginBottom: 4,
  },
  pagination: {
    marginVertical: 14,
  },
  ctaButton: {
    width: '100%',
    marginTop: 6,
  },
});
