'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeThought(thoughtId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error } = await supabase
    .from('thoughts')
    .update({ status: 'completado' })
    .eq('id', thoughtId)

  if (error) {
    console.error("Error al completar:", error.message)
    return { success: false }
  }

  // Esto refresca el Dashboard automáticamente
  revalidatePath('/dashboard')
  return { success: true }
}