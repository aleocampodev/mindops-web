'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { MissionStatus } from '@/lib/constants/mission-status'
import { z } from 'zod'

const advanceMissionStepSchema = z.object({
  missionId: z.string().uuid(),
  currentIndex: z.number().int().min(0),
  totalSteps: z.number().int().min(1),
})

export async function advanceMissionStep(missionId: string, currentIndex: number, totalSteps: number) {
  try {
    const input = advanceMissionStepSchema.parse({ missionId, currentIndex, totalSteps })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { completed: false, error: 'Unauthorized' }

    const nextIndex = input.currentIndex + 1

    if (nextIndex >= input.totalSteps) {
      // Mission Complete
      const { error } = await supabase
        .schema('mindops')
        .from('thoughts')
        .update({
          current_step_index: nextIndex,
          status: MissionStatus.COMPLETED
        })
        .eq('id', input.missionId)

      if (error) return { completed: false, error: error.message }

      revalidatePath('/dashboard')
      revalidatePath(`/mission/${input.missionId}`)
      return { completed: true }
    } else {
      // Advance Step
      const { error } = await supabase
        .schema('mindops')
        .from('thoughts')
        .update({ current_step_index: nextIndex })
        .eq('id', input.missionId)

      if (error) return { completed: false, error: error.message }

      revalidatePath(`/mission/${input.missionId}`)
      return { completed: false }
    }
  } catch (err: unknown) {
    const message = err instanceof z.ZodError
      ? `Validation error: ${err.issues.map(e => e.message).join(', ')}`
      : err instanceof Error ? err.message : 'Unknown error'
    return { completed: false, error: message }
  }
}
