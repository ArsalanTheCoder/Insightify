/**
 * Insightify — Auth Stack Navigator
 *
 * Stack navigator containing all authentication & password recovery screens.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 4.1
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../features/auth/screens/LoginScreen';
import RegisterScreen from '../../features/auth/screens/RegisterScreen';
import ForgotPasswordScreen from '../../features/auth/screens/ForgotPasswordScreen';
import ResetLinkSentScreen from '../../features/auth/screens/ResetLinkSentScreen';
import ResetPasswordScreen from '../../features/auth/screens/ResetPasswordScreen';
import PasswordUpdatedScreen from '../../features/auth/screens/PasswordUpdatedScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetLinkSent" component={ResetLinkSentScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="PasswordUpdated" component={PasswordUpdatedScreen} />
    </Stack.Navigator>
  );
}
