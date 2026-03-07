'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function generatePairingCode() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Not authenticated' }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString()

    const date = new Date()
    date.setMinutes(date.getMinutes() + 10)

    const { error } = await supabase
      .schema('mindops')
      .from('profiles')
      .upsert({
        id: user.id,
        pairing_code: newCode,
        pairing_code_expires_at: date.toISOString(),
        onboarding_state: 'PENDING_LINK'
      }, { onConflict: 'id' })

    if (error) {
      console.error('Error generating pairing code:', error.message)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/pairing')
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Unexpected error in generatePairingCode:', message)
    return { success: false, error: message }
  }
}