import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 'next' es a donde queremos ir después (dashboard)
  const next = searchParams.get('next') ?? '/dashboard/pairing'

  if (code) {
    const supabase = await createClient()

    // Este es el paso que está fallando: el intercambio de "código" por "sesión"
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 🧠 Lógica Proactiva: ¿Ya está vinculado?
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', user?.id)
        .single()

      const targetPath = profile?.telegram_id ? '/dashboard' : '/dashboard/pairing'
      return NextResponse.redirect(`${origin}${targetPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failure`)
}