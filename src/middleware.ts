import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'es']
const DEFAULT_LOCALE = 'en'

export async function middleware(request: NextRequest) {

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })


  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return response
  }

  const supabase = createServerClient(
    url,
    key,
    {
      db: {
        schema: 'mindops',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )


  const { data: { user } } = await supabase.auth.getUser()

  // --- LOCALE DETECTION LOGIC ---
  let locale: string | undefined

  // 1. URL Param (highest priority for links from Telegram)
  const urlParam = request.nextUrl.searchParams.get('lang') || request.nextUrl.searchParams.get('locale')
  if (urlParam && SUPPORTED_LOCALES.includes(urlParam)) {
    locale = urlParam
  }

  // 2. Profile preference (if logged in)
  if (!locale && user) {
    const { data: profile } = await supabase
      .schema('mindops')
      .from('profiles')
      .select('language')
      .eq('id', user.id)
      .single()
    
    if (profile?.language && SUPPORTED_LOCALES.includes(profile.language)) {
      locale = profile.language
    }
  }

  // 3. Telegram Session (if not logged in but has a session_id)
  // Note: We expect the session_id to be passed as a query param or exist in a cookie
  const sessionId = request.nextUrl.searchParams.get('session_id') || request.cookies.get('tg_session_id')?.value
  if (!locale && !user && sessionId) {
    const { data: tgSession } = await supabase
      .schema('mindops')
      .from('telegram_sessions')
      .select('language')
      .eq('id', sessionId)
      .single()
    
    if (tgSession?.language && SUPPORTED_LOCALES.includes(tgSession.language)) {
      locale = tgSession.language
    }
  }

  // 4. Cookie preference
  if (!locale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
      locale = cookieLocale
    }
  }

  // 5. Browser headers
  if (!locale) {
    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split('-')[0]
      if (SUPPORTED_LOCALES.includes(preferred)) {
        locale = preferred
      }
    }
  }

  // 6. Final Fallback
  locale = locale || DEFAULT_LOCALE

  // Set the cookie for future requests
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  // ⚠️ CRITICAL CORE SYNC: Propagate the locale to the request headers 
  // so Server Components can see it immediately.
  response.headers.set('x-next-intl-locale', locale)
  
  // Clone request headers to modify them for the incoming request
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-next-intl-locale', locale)
  
  // Create a new response with the modified request headers
  response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Re-apply the cookie to the new response
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })


  // --- NAVIGATION LOGIC ---
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isLogin = request.nextUrl.pathname.startsWith('/login')

  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLogin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Excluimos explícitamente:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - auth (LA RUTA DE CALLBACK DEBE ESTAR LIBRE)
     * - api routes (optional, but keep them for now)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}