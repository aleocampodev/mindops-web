import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a dummy client during build to prevent crashes
    return {} as any
  }

  return createServerClient(
    url,
    key,
    {
      db: {
        schema: 'mindops',
      },
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(payload) {
          payload.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}