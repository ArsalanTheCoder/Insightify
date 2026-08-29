/**
 * Insightify — FeedStack
 *
 * Stack navigator for Feed and Feed Detail screens.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 4
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../features/feed/screens/FeedScreen';
import FeedDetailScreen from '../features/feed/screens/FeedDetailScreen';

const Stack = createNativeStackNavigator();

export default function FeedStack() {
  return (
    <Stack.Navigator
      initialRouteName="FeedMain"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="FeedMain" component={FeedScreen} />
      <Stack.Screen name="FeedDetail" component={FeedDetailScreen} />
    </Stack.Navigator>
  );
}
