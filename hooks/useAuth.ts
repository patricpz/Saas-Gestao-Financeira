'use client';

import { useAuth as useAuthContext } from '@/context/AuthContext';

export function useAuth() {
  const { user, session, loading } = useAuthContext();
  const isAuthenticated = !!user;

  return {
    session,
    userId: user?.id,
    accessToken: session?.accessToken || user?.accessToken,
    isLoading: loading,
    isAuthenticated,
  };
}

export function useRequireAuth() {
  const { session, userId, accessToken, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return { isLoading: true };
  }

  if (!isAuthenticated || !userId) {
    return { isUnauthorized: true };
  }

  if (!accessToken) {
    console.warn('No access token found in session');
  }

  return {
    userId,
    session,
    isLoading: false,
    isUnauthorized: false,
  };
}
