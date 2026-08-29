/**
 * Insightify — Root Navigator
 *
 * Deterministic root gating coordinator:
 *   1. Splash state (initialization)
 *   2. OnboardingStack (first-time users)
 *   3. AuthStack (unauthenticated users)
 *   4. AppStack (authenticated dashboard)
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 4.1
 */

import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useOnboardingStore } from '../../features/onboarding/store/onboardingStore';
import { useAuthStore } from '../../features/auth/store/authStore';

import SplashScreen from '../../features/auth/screens/SplashScreen';
import OnboardingStack from './OnboardingStack';
import AuthStack from './AuthStack';
import AppStack from '../../navigation/AppStack';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isSplashDone, setIsSplashDone] = useState(false);
  const { hasSeenOnboarding, isLoading: isOnboardingLoading } = useOnboardingStore();
  const { isAuthenticated } = useAuthStore();

  // Show Splash while loading initial state or running splash animation
  if (!isSplashDone || isOnboardingLoading) {
    return <SplashScreen onFinish={() => setIsSplashDone(true)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : !isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}
