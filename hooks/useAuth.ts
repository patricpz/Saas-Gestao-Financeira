'use client';

import { useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  const { user, token, isLoading, isAuthenticated } = useAuthContext();

  return {
    user,
    token,
    userId: user?.id,
    isLoading,
    isAuthenticated,
  };
}

export function useRequireAuth() {
  const { user, token, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return { isLoading: true };
  }

  if (!isAuthenticated || !user?.id) {
    return { isUnauthorized: true };
  }

  if (!token) {
    console.warn('No access token found');
  }

  return {
    userId: user.id,
    user,
    token,
    isLoading: false,
    isUnauthorized: false,
  };
}
