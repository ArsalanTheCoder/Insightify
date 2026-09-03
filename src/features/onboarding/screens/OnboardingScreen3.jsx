/**
 * Insightify — Onboarding Screen 3: "Stay protected, always."
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import OnboardingSlide from '../components/OnboardingSlide';
import { useOnboardingStore } from '../store/onboardingStore';

const HERO_IMAGE = require('../../../../assets/onboarding/stay-protected.png');

export default function OnboardingScreen3() {
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const handleComplete = () => {
    completeOnboarding();
  };

  return (
    <OnboardingSlide
      imageSource={HERO_IMAGE}
      titlePrefix="Stay protected,"
      titleHighlight="always."
      description="Get real-time alerts, block threats, and stay one step ahead. Your safety is our mission."
      currentStep={2}
      totalSteps={3}
      onNext={handleComplete}
      onSkip={handleComplete}
      ctaTitle="Next →"
    />
  );
}
