'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function advanceMissionStep(missionId: string, currentIndex: number, totalSteps: number) {
  const supabase = await createClient()
  const nextIndex = currentIndex + 1

  if (nextIndex >= totalSteps) {
    // Mission Complete
    const { error } = await supabase
      .from('thoughts')
      .update({
        current_step_index: nextIndex,
        status: 'completado'
      })
      .eq('id', missionId)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    revalidatePath(`/mission/${missionId}`)
    return { completed: true }
  } else {
    // Advance Step
    const { error } = await supabase
      .from('thoughts')
      .update({ current_step_index: nextIndex })
      .eq('id', missionId)

    if (error) throw new Error(error.message)

    revalidatePath(`/mission/${missionId}`)
    return { completed: false }
  }
}
