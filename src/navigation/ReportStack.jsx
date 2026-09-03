/**
 * Insightify — ReportStack
 *
 * Dedicated stack wrapper for the unified Report flow.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportScreen from '../features/reports/screens/ReportScreen';

const Stack = createNativeStackNavigator();

export default function ReportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportMain" component={ReportScreen} />
    </Stack.Navigator>
  );
}
