import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // 'next' is where we want to go after
  const next = requestUrl.searchParams.get('next') ?? '/dashboard/pairing'

  // 🧠 FIX: Detect the real host (Cloud Run/Proxy) to avoid the 0.0.0.0:8080 bug
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const origin = `${protocol}://${host}`

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', user?.id)
        .single()

      const targetPath = profile?.telegram_id ? '/dashboard' : '/dashboard/pairing'
      const redirectUrl = new URL(targetPath, origin)

      return NextResponse.redirect(redirectUrl)
    }
  }

  // Si algo falla, volver al login
  const errorUrl = new URL('/login?error=auth-failure', origin)
  return NextResponse.redirect(errorUrl)
}