/**
 * Insightify — Onboarding Screen 1: "Scams are evolving."
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import OnboardingSlide from '../components/OnboardingSlide';
import { useOnboardingStore } from '../store/onboardingStore';

const HERO_IMAGE = require('../../../../assets/onboarding/scams-evolving.png');

export default function OnboardingScreen1() {
  const navigation = useNavigation();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  const handleNext = () => {
    navigation.navigate('Onboarding2');
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <OnboardingSlide
      imageSource={HERO_IMAGE}
      titlePrefix="Scams are"
      titleHighlight="evolving."
      description="Every day, new AI scams, fake texts, calls, and deepfakes put you at risk. Don't be the next victim."
      currentStep={0}
      totalSteps={3}
      onNext={handleNext}
      onSkip={handleSkip}
      ctaTitle="Next →"
    />
  );
}
