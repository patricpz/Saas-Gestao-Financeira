import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria o cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Obtém a sessão atual
  console.log('=== MIDDLEWARE START ===')
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl
  
  console.log('Path:', pathname)
  console.log('Has session:', !!session)
  if (sessionError) console.error('Session error:', sessionError)
  if (session) console.log('Session user:', session.user?.email)

  // Se a rota for a raiz, redireciona para o dashboard se autenticado
  if (pathname === '/') {
    if (session) {
      console.log('Root path with session, redirecting to /dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('Root path, no session, allowing access')
    return NextResponse.next()
  }

  // Verifica se a rota é protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Se for uma rota de API, permite o acesso
  if (pathname.startsWith('/api/')) {
    return response
  }

  // Se a rota for protegida e o usuário não estiver autenticado, redireciona para o login
  if (isProtectedRoute) {
    // Se não conseguiu carregar a sessão ainda, libera para o client resolver
    if (session === null) {
      console.log('Protected route, no session yet (allowing client to handle)')
      return response
    }
  
    if (!session?.user) {
      console.log('Protected route, no valid user, redirecting to login')
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  
    console.log('Protected route, valid session, allowing access')
    return response
  }
  

  // Se o usuário estiver autenticado e tentar acessar uma rota de login/register, redireciona para o dashboard
  if ((pathname === '/login' || pathname === '/register') && session) {
    console.log('Authenticated user trying to access auth page, redirecting to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
