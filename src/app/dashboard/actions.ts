'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { MissionStatus } from '@/lib/constants/mission-status'
import { z } from 'zod'
import { getTranslations } from 'next-intl/server'


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
    const t = await getTranslations('Common')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: t('unauthorized') }


    const { error } = await supabase
      .schema('mindops')
      .from('thoughts')
      .update({ status: MissionStatus.COMPLETED })
      .eq('id', input.thoughtId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: unknown) {
    const t = await getTranslations('Common')
    const message = err instanceof z.ZodError
      ? `${t('validationError')}: ${err.issues.map((e: { message: string }) => e.message).join(', ')}`
      : err instanceof Error ? err.message : t('unknownError')
    return { success: false, error: message }
  }

}

export async function updateMissionStep(thoughtId: string, nextStep: number, isFinal: boolean) {
  try {
    const input = updateMissionStepSchema.parse({ thoughtId, nextStep, isFinal })
    const t = await getTranslations('Common')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: t('unauthorized') }


    const updateData: { current_step_index: number; status?: string } = {
      current_step_index: input.nextStep
    }
    if (input.isFinal) {
      updateData.status = MissionStatus.COMPLETED
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
    const t = await getTranslations('Common')
    const message = err instanceof z.ZodError
      ? `${t('validationError')}: ${err.issues.map((e: { message: string }) => e.message).join(', ')}`
      : err instanceof Error ? err.message : t('unknownError')
    return { success: false, error: message }
  }

}