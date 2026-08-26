import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Custom Tab Bar
import CustomTabBar from '../components/navigation/CustomTabBar';

// Screens / Stacks
import FeedScreen from '../screens/Feed/FeedScreen';
import ReportStack from './ReportStack';
import DetectStack from './DetectStack';
import ProfileStack from './ProfileStack';
import GamesStack from './GamesStack';

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
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Detect" component={DetectStack} />
      <Tab.Screen name="Report" component={ReportStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
