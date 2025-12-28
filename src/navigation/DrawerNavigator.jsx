import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/layout/CustomDrawerContent';

// Screens
import HomeScreen from '../screens/Dashboard/HomeScreen';
import DetectionNavigator from '../screens/Detection/DetectionNavigator'; 

const Drawer = createDrawerNavigator();

// --- 1. DEFINE THESE OUTSIDE THE COMPONENT ---
// This fixes the "inline function" warning
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen Coming Soon</Text>
  </View>
);

const HistoryScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>History Screen Coming Soon</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen Coming Soon</Text>
  </View>
);
// ---------------------------------------------

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#E3F2FD',
        drawerActiveTintColor: '#0056D2',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { marginLeft: -20, fontSize: 15, fontWeight: '500' },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={HomeScreen} 
        options={{ drawerIcon: () => <Text>🏠</Text> }}
      />
      
      {/* 2. USE THE CONSTANTS HERE */}
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ drawerIcon: () => <Text>👤</Text> }}
      />
      <Drawer.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ drawerIcon: () => <Text>📜</Text> }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ drawerIcon: () => <Text>⚙️</Text> }}
      />

      <Drawer.Screen 
        name="Detection" 
        component={DetectionNavigator} 
        options={{ 
          drawerItemStyle: { display: 'none' }, 
          swipeEnabled: false 
        }}
      />
    </Drawer.Navigator>
  );
}