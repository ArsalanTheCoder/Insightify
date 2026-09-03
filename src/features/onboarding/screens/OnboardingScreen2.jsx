/**
 * Insightify — Onboarding Screen 2: "AI has the power to detect."
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import OnboardingSlide from '../components/OnboardingSlide';
import { useOnboardingStore } from '../store/onboardingStore';

const HERO_IMAGE = require('../../../../assets/onboarding/ai-detection.png');

export default function OnboardingScreen2() {
  const navigation = useNavigation();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const handleNext = () => {
    navigation.navigate('Onboarding3');
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <OnboardingSlide
      imageSource={HERO_IMAGE}
      titlePrefix="AI has the power to"
      titleHighlight="detect."
      description="Our multimodal AI analyzes text, images, audio, and video to catch what humans miss."
      currentStep={1}
      totalSteps={3}
      onNext={handleNext}
      onSkip={handleSkip}
      ctaTitle="Next →"
    />
  );
}
