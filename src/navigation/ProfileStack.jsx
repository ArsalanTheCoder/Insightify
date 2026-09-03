/**
 * Insightify — ProfileStack (Navigation Stack)
 *
 * Coordinates Profile, Settings, Edit Profile, Leaderboard, Champion, Achievements,
 * and Scan History screens.
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../features/profile/screens/ProfileScreen';
import SettingsScreen from '../features/profile/screens/SettingsScreen';
import EditProfileScreen from '../features/profile/screens/EditProfileScreen';
import LeaderboardScreen from '../features/profile/screens/LeaderboardScreen';
import ChampionScreen from '../features/profile/screens/ChampionScreen';
import AchievementsScreen from '../features/profile/screens/AchievementsScreen';
import ScanHistoryScreen from '../features/detection/screens/ScanHistoryScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Champion" component={ChampionScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
    </Stack.Navigator>
  );
}
