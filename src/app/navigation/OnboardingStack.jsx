/**
 * Insightify — Onboarding Stack Navigator
 *
 * Stack navigator covering the 3-step onboarding flow.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 4.1
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen1 from '../../features/onboarding/screens/OnboardingScreen1';
import OnboardingScreen2 from '../../features/onboarding/screens/OnboardingScreen2';
import OnboardingScreen3 from '../../features/onboarding/screens/OnboardingScreen3';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
    </Stack.Navigator>
  );
}
