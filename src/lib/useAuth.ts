import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, logout as apiLogout } from './api';
import { LocalStorageKeys, QueryKeys } from './types';

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({ queryKey: [QueryKeys.Me], queryFn: fetchMe });

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem(LocalStorageKeys.Token);
    queryClient.removeQueries({ queryKey: [QueryKeys.Me] });
  };

  return {
    user,
    loading,
    error,
    refetch,
    logout,
  };
} 