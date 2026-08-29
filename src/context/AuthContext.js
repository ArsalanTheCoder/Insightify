/**
 * AuthContext — Temporary placeholder.
 *
 * Firebase has been removed. This placeholder keeps the app buildable
 * while the Authentication RFC is prepared. It will be replaced by
 * Zustand + TanStack Query auth state once the RFC is approved.
 *
 * TODO(RFC-001): Replace with production auth implementation.
 */
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        // Ignore load errors — user will be treated as unauthenticated
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('hasSeenOnboarding');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
