'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { MissionStatus } from '@/lib/constants/mission-status'

export async function completeThought(thoughtId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('mindops')
    .from('thoughts')
    .update({ status: MissionStatus.COMMITTED })
    .eq('id', thoughtId)

  if (error) {
    console.error("Error completing:", error.message)
    return { success: false }
  }

  // Revalidate dashboard cache after mutation
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateMissionStep(thoughtId: string, nextStep: number, isFinal: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: { current_step_index: number; status?: string } = { current_step_index: nextStep }
  if (isFinal) {
    updateData.status = MissionStatus.COMMITTED
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