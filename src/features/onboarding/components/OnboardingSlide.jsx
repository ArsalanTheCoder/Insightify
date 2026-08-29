/**
 * Insightify — OnboardingSlide (Component)
 *
 * Reusable slide template for all 3 onboarding screens.
 * Strictly implements the approved visual hierarchy from UI references:
 * Illustration → Heading → Description → Pagination → CTA.
 * Fully responsive across all Android device heights & widths.
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
  const { colors, typography, spacing } = useTheme();
  const { width, height, scaleFont, isSmallDevice } = useResponsive();

  const maxImageHeight = Math.min(Math.round(height * 0.42), 340);
  const imageWidth = Math.min(Math.round(width * 0.88), 350);

  return (
    <ScreenContainer withPadding={true} style={styles.container}>
      {/* Top Bar: Skip button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onSkip}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={[typography.label, { color: colors.textSecondary, fontSize: scaleFont(13, 0.3) }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Large Responsive Hero Illustration */}
      <View style={[styles.imageWrapper, { maxHeight: maxImageHeight }]}>
        <Image
          source={imageSource}
          style={[styles.image, { width: imageWidth }]}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* 2. Content Block: Heading → Description → Pagination → CTA */}
      <View style={styles.contentBlock}>
        {/* Heading */}
        <Text style={[typography.h1, styles.title, { fontSize: scaleFont(isSmallDevice ? 24 : 28, 0.3) }]}>
          <Text style={{ color: colors.textPrimary }}>{titlePrefix} </Text>
          <Text style={{ color: colors.primary }}>{titleHighlight}</Text>
        </Text>

        {/* Description */}
        <Text
          style={[
            typography.body,
            styles.description,
            { color: colors.textSecondary, fontSize: scaleFont(isSmallDevice ? 13 : 14.5, 0.3) },
          ]}
        >
          {description}
        </Text>

        {/* Pagination */}
        <OnboardingPagination
          total={totalSteps}
          current={currentStep}
          style={{ marginVertical: spacing.md }}
        />

        {/* CTA */}
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
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 6,
    paddingBottom: 4,
    minHeight: 36,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  image: {
    height: '100%',
  },
  contentBlock: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 21,
  },
  ctaButton: {
    width: '100%',
    marginTop: 6,
  },
});
