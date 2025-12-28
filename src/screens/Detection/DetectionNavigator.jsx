import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import TextInputScreen from './TextDetection/TextInputScreen';
import TextResultScreen from './TextDetection/TextResultScreen';

const Stack = createNativeStackNavigator();

export default function DetectionNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // We will use custom headers in the screens
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TextInput" component={TextInputScreen} />
      <Stack.Screen name="TextResultScreen" component={TextResultScreen} />
    </Stack.Navigator>
  );
}