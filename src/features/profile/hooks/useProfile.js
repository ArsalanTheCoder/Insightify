/**
 * Insightify — useProfile (Hook)
 *
 * Coordinates TanStack Query for User Profile data, stats, and profile editing mutation.
 *
 * AGENTS.md & docs/RULES.md
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../services/profileApi';

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', 'currentUser'],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile', 'currentUser'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: profileQuery.data || null,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
