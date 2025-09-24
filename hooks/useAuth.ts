'use client';

import { useSession } from 'next-auth/react';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
}

interface AuthSession {
  user: SessionUser;
  expires: string;
  accessToken?: string;
}

export function useAuth() {
  const { data: session, status } = useSession() as {
    data: AuthSession | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
  
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const userId = session?.user?.id;
  const accessToken = session?.accessToken || session?.user?.accessToken;

  return {
    session,
    userId,
    accessToken,
    isLoading,
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
