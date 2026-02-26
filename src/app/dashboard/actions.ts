'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeThought(thoughtId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('mindops')
    .from('thoughts')
    .update({ status: 'completado' })
    .eq('id', thoughtId)

  if (error) {
    console.error("Error completing:", error.message)
    return { success: false }
  }

  // Esto refresca el Dashboard automáticamente
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateMissionStep(thoughtId: string, nextStep: number, isFinal: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = { current_step_index: nextStep }
  if (isFinal) {
    updateData.status = 'completado'
  }

  const { error } = await supabase
    .schema('mindops')
    .from('thoughts')
    .update(updateData)
    .eq('id', thoughtId)

  if (error) {
    console.error("Error updating step:", error.message)
    return { success: false }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/mission/${thoughtId}`)
  return { success: true }
}