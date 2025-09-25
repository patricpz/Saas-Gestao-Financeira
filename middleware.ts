import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/transactions',
  '/profile',
  '/reports',
  '/settings'
]

// Define public routes that should not be accessible when authenticated
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

// Allow specific API routes without authentication
const publicApiRoutes = [
  '/api/auth/register',
  '/api/health'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // 🔹 Tratar assets e arquivos estáticos separadamente
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
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
    pathname.startsWith(route) || pathname === route
  )
  
  // 🔹 Public routes
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from public routes (mas nunca do dashboard)
  if (isPublicRoute && token && !pathname.startsWith('/api/') && pathname !== '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|css|js)$).*)',
  ],
}
