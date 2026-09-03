/**
 * Insightify — DetectStack (Navigation Stack)
 *
 * Coordinates Detect, Scan History, and unified Scan Result screens.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 4
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DetectScreen from '../features/detection/screens/DetectScreen';
import ScanHistoryScreen from '../features/detection/screens/ScanHistoryScreen';
import ResultScreen from '../features/detection/screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function DetectStack() {
  return (
    <Stack.Navigator
      initialRouteName="DetectMain"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DetectMain" component={DetectScreen} />
      <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
      <Stack.Screen name="ScanResult" component={ResultScreen} />
    </Stack.Navigator>
  );
}
