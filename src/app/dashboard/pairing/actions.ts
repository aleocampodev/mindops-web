'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function generatePairingCode() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const newCode = Math.floor(100000 + Math.random() * 900000).toString()

  // El código expira en 10 minutos
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);

  await supabase
    .schema('mindops')
    .from('profiles')
    .upsert({
      id: user.id,
      pairing_code: newCode,
      pairing_code_expires_at: date.toISOString()
    }, { onConflict: 'id' })

  revalidatePath('/dashboard/pairing')
}