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
  
  // Allow API routes to be accessed without authentication
  if (pathname.startsWith('/api/')) {
    // Check if the API route is in the public list
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))
    if (isPublicApiRoute) {
      return NextResponse.next()
    }
    
    // For protected API routes, check for authentication
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Add user ID to request headers for API routes
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

  // Handle root path
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || 
    pathname === route
  )
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || 
    pathname === route ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  )

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from public routes
  if (isPublicRoute && token && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public folder files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|css|js)$).*)',
  ],
}
