import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ReportScreen from '../features/reports/screens/ReportScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      {/*
       * ReportScreen is registered at the App level so it can be
       * navigated to from any tab stack (FeedDetail, ScanResult, etc.)
       * without being a bottom-navigation tab item.
       */}
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
