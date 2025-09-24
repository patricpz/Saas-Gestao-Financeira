'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, getSession } from 'next-auth/react'

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const session = await getSession()
        if (session?.user) {
          setSession(session as any)
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name,
            image: session.user.image
          })
        } else {
          setSession(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { ok: false, error: result.error }
      }

      // Get the updated session
      const session = await getSession()
      if (session?.user) {
        setSession(session as any)
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.name,
          image: session.user.image,
          accessToken: (session as any).accessToken || (session.user as any).accessToken,
        })
      }

      return { ok: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { ok: false, error: 'Erro ao fazer login. Tente novamente.' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { ok: false, error: data.error || 'Registration failed' }
      }

      return { ok: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { ok: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false })
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
