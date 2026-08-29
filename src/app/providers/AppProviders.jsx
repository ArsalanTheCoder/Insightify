/**
 * Insightify — Root App Providers
 *
 * Central composition of all application-level providers:
 *   - TanStack Query (Server state)
 *   - Safe Area Context
 *   - Legacy Contexts (temporary bridges until RFC-001 replaces them)
 *
 * docs/RULES.md sections 7.1, 11
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../context/AuthContext';
import { OnboardingProvider } from '../../context/OnboardingContext';

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
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export { queryClient };
