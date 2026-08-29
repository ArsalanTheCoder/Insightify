/**
 * Insightify — TabNavigator
 *
 * 5-tab application bottom navigator:
 * Home | Feed | Detect (Center Floating Shield) | Learn | Profile
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 7
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Custom Tab Bar
import CustomTabBar from '../components/navigation/CustomTabBar';

// Screens / Stacks
import HomeScreen from '../features/home/screens/HomeScreen';
import FeedStack from './FeedStack';
import DetectStack from './DetectStack';
import GamesStack from './GamesStack'; // Serves as Learn stack
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const renderTabBar = (props) => <CustomTabBar {...props} />;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Detect" component={DetectStack} />
      <Tab.Screen name="Learn" component={GamesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
