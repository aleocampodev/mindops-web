'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'


import { generatePairingCodeData } from '@/lib/pairing/helpers'


export async function generatePairingCode() {
  try {
    const t = await getTranslations('Common')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: t('unauthorized') }


    const { code: newCode, expiresAt } = generatePairingCodeData()


    const { error } = await supabase
      .schema('mindops')
      .from('profiles')
      .upsert({
        id: user.id,
        pairing_code: newCode,
        pairing_code_expires_at: expiresAt,
        onboarding_state: 'PENDING_LINK'
      }, { onConflict: 'id' })

    if (error) {
      console.error('Error generating pairing code:', error.message)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/pairing')
    return { success: true }
  } catch (err) {
    const t = await getTranslations('Common')
    const message = err instanceof Error ? err.message : t('unknownError')
    console.error('Unexpected error in generatePairingCode:', message)
    return { success: false, error: message }
  }

}