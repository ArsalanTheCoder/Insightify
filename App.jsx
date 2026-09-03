// App.jsx — Root App with AppProviders + Theme + RootNavigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import AppProviders from './src/app/providers/AppProviders';
import { useTheme } from './src/shared/hooks/useTheme';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';

function AppContent() {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}