import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rotas que exigem autenticação
const protectedRoutes = [
  '/dashboard',
  '/transactions',
  '/profile',
  '/reports',
  '/settings'
]

// Rotas públicas que não devem ser acessadas quando autenticado
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/api/auth/signin',
  '/api/auth/error',
  '/api/auth/signout',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/session',
  '/api/auth/callback/credentials',
  '/api/auth/register'
]

// Rotas de API públicas (sem autenticação)
const publicApiRoutes = [
  '/api/auth/register',
  '/api/health'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Debug log
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Middleware -> Path: ${pathname}`)
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`🔑 Token: ${token ? 'Present' : 'Missing'}`)
  }

  // Ignorar assets estáticos e arquivos do Next.js
  const isStaticAsset =
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')

  if (isStaticAsset) {
    return NextResponse.next()
  }

  // 🔹 API Routes
  if (pathname.startsWith('/api/')) {
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))
    if (isPublicApiRoute) {
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestHeaders = new Headers(request.headers)
    if (token.sub) {
      requestHeaders.set('x-user-id', token.sub)
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // 🔹 Root path
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 🔹 Protected routes
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // 🔹 Public routes
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Se for rota protegida e não tiver token → redireciona para login
  if (isProtectedRoute && !token) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚫 Redirecting unauthenticated user from ${pathname} to login`)
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se for rota pública e tiver token → redireciona para dashboard
  if (isPublicRoute && token && !pathname.startsWith('/api/') && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|css|js)$).*)',
  ],
}
