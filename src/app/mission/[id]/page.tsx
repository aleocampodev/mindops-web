import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { MissionManager } from './MissionManager'

export default async function MissionPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
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
  if (mission.status === 'completado') redirect('/dashboard')

  // Parsing JSON plan_de_accion
  let plan = mission.plan_de_accion
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
      title={mission.titulo_resumen || mission.accion_inmediata || 'Active Mission'}
      strategicAnalysis={mission.analisis_estrategico}
      summaryTitle={mission.titulo_resumen}
    />
  )
}
