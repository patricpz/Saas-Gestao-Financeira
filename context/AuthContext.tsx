'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { DATA_SOURCE } from '@/lib/services/config'

interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  accessToken?: string
}

interface Session {
  user: User
  expires: string
  accessToken?: string
}

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ 
    ok: boolean
    error?: string 
  }>
  signUp: (email: string, password: string, name: string) => Promise<{ 
    ok: boolean
    error?: string 
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'mock_auth_session'
const COOKIE_NAME = 'access_token'

const setCookie = (name: string, value: string, days = 1) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`
}

const clearCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setLoading(false)
      return
    }

    try {
      const parsed = JSON.parse(raw) as { user: User; accessToken: string; expires: string }
      if (parsed?.user) {
        setUser(parsed.user)
        setSession({
          user: parsed.user,
          accessToken: parsed.accessToken,
          expires: parsed.expires,
        })
      }
    } catch (error) {
      console.error('Error reading mock auth session:', error)
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, _password: string) => {
    try {
      if (DATA_SOURCE === 'http') {
        return { ok: false, error: 'Login externo ainda não configurado.' }
      }

      const now = Date.now()
      const accessToken = `mock_${now}`
      const mockUser: User = {
        id: `mock_${now}`,
        email,
        name: email.split('@')[0],
        image: null,
        accessToken,
      }

      const expires = new Date(now + 24 * 60 * 60 * 1000).toISOString()

      const newSession: Session = {
        user: mockUser,
        accessToken,
        expires,
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: mockUser, accessToken, expires })
      )

      setCookie(COOKIE_NAME, accessToken, 1)

      setUser(mockUser)
      setSession(newSession)

      return { ok: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { ok: false, error: 'Erro ao fazer login. Tente novamente.' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await authService.register({ email, password, name })
      if (!result.ok) {
        return { ok: false, error: result.error || 'Registration failed' }
      }
      return { ok: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { ok: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY)
    clearCookie(COOKIE_NAME)
    setSession(null)
    setUser(null)
    router.push('/login')
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
