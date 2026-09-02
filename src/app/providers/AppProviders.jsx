/**
 * Insightify — Root App Providers
 *
 * Central composition of all application-level providers:
 *   - TanStack Query (Server state)
 *   - Safe Area Context
 *   - AuthProvider
 *
 * docs/RULES.md sections 7.1, 11
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppProviders({ children }) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export { queryClient };
