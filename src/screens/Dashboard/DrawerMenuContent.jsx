import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

// Placeholder Avatar
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0056D2&color=fff';

export default function CustomDrawerContent(props) {
  const user = auth().currentUser;

  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#0056D2' }}>
        
        {/* Drawer Header (User Profile) */}
        <View style={styles.header}>
          <Image 
            source={{ uri: user?.photoURL || DEFAULT_AVATAR }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>{user?.displayName || 'Insightify User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>🛡️ Cyber Guardian</Text>
          </View>
        </View>

        {/* White Section for Menu Items */}
        <View style={styles.menuContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout Section */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>v1.0.0 • Insightify</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#0056D2',
    marginBottom: 10,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: '#E0E0E0',
    fontSize: 13,
    marginBottom: 10,
  },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  rankText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
  },
  logoutBtn: {
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D9534F',
  },
  version: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
  },
});