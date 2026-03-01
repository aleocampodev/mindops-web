'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { MissionStatus } from '@/lib/constants/mission-status'

export async function advanceMissionStep(missionId: string, currentIndex: number, totalSteps: number) {
  const supabase = await createClient()

  // Auth guard — verify user owns this mission before mutating
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const nextIndex = currentIndex + 1

  if (nextIndex >= totalSteps) {
    // Mission Complete
    const { error } = await supabase
      .schema('mindops')
      .from('thoughts')
      .update({
        current_step_index: nextIndex,
        status: MissionStatus.COMMITTED
      })
      .eq('id', missionId)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    revalidatePath(`/mission/${missionId}`)
    return { completed: true }
  } else {
    // Advance Step
    const { error } = await supabase
      .schema('mindops')
      .from('thoughts')
      .update({ current_step_index: nextIndex })
      .eq('id', missionId)

    if (error) throw new Error(error.message)

    revalidatePath(`/mission/${missionId}`)
    return { completed: false }
  }
}
