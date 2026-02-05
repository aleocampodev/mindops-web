'use client'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <button onClick={handleLogin} className="bg-white text-black px-6 py-3 rounded-2xl font-bold shadow-lg">
      Entrar con Google
    </button>
  )
}