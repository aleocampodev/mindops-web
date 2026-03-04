'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { MissionStatus } from '@/lib/constants/mission-status'
import { z } from 'zod'

const completeThoughtSchema = z.object({
  thoughtId: z.string().uuid(),
})

const updateMissionStepSchema = z.object({
  thoughtId: z.string().uuid(),
  nextStep: z.number().int().min(0),
  isFinal: z.boolean(),
})

export async function completeThought(thoughtId: string) {
  try {
    const input = completeThoughtSchema.parse({ thoughtId })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .schema('mindops')
      .from('thoughts')
      .update({ status: MissionStatus.COMMITTED })
      .eq('id', input.thoughtId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof z.ZodError
      ? `Validation error: ${err.issues.map((e: { message: string }) => e.message).join(', ')}`
      : err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function updateMissionStep(thoughtId: string, nextStep: number, isFinal: boolean) {
  try {
    const input = updateMissionStepSchema.parse({ thoughtId, nextStep, isFinal })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const updateData: { current_step_index: number; status?: string } = {
      current_step_index: input.nextStep
    }
    if (input.isFinal) {
      updateData.status = MissionStatus.COMMITTED
    }

    const { error } = await supabase
      .schema('mindops')
      .from('thoughts')
      .update(updateData)
      .eq('id', input.thoughtId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/mission/${input.thoughtId}`)
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof z.ZodError
      ? `Validation error: ${err.issues.map((e: { message: string }) => e.message).join(', ')}`
      : err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}