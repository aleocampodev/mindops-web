import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { MissionManager } from './MissionManager'
import { MissionStatus } from '@/lib/constants/mission-status'
import { getTranslations } from 'next-intl/server'


export default async function MissionPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations('Dashboard')
  const supabase = await createClient()

  const { id } = await paramsPromise

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: mission, error } = await supabase
    .schema('mindops')
    .from('thoughts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !mission) notFound()
  if (mission.status === MissionStatus.COMPLETED) redirect('/dashboard')

  // Parse JSON action_plan field
  let plan = mission.action_plan
  if (typeof plan === 'string') {
    try {
      plan = JSON.parse(plan)
    } catch (e) {
      plan = []
    }
  }

  return (
    <MissionManager 
      missionId={id}
      initialStep={mission.current_step_index || 0}
      plan={plan || []}
      title={mission.summary_title || t('activeMission')}
      strategicAnalysis={mission.strategic_insight}
      summaryTitle={mission.summary_title}
    />
  )
}
