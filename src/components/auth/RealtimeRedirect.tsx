'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

export function RealtimeRedirect({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'mindops',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          if (payload.new.phone_number) {
            // Pairing completo: telegram_id + phone_number → ir al dashboard
            router.push('/dashboard')
          } else if (payload.new.telegram_id) {
            // Código aceptado por Telegram, pero aún falta el contacto
            router.refresh()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, router])

  return null
}