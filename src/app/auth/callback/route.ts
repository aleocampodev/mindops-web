import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    
    // Intercambio: Código de Google -> Sesión JWT real
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 1. Verificamos si este usuario ya pasó por Telegram alguna vez
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', user?.id)
        .single()

      // 2. Redirección Inteligente (UX Senior):
      // Si ya tiene Telegram ID, va al Dashboard. Si no, a Vincular.
      const targetPath = profile?.telegram_id ? '/dashboard' : '/dashboard/pairing'
      return NextResponse.redirect(`${origin}${targetPath}`)
    }
  }

  // Si hay un fallo crítico de Google o Supabase
  return NextResponse.redirect(`${origin}/login?error=auth-failure`)
}