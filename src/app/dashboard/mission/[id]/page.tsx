import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { MissionView } from './MissionView';

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: thought } = await supabase
    .from('thoughts')
    .select('*')
    .eq('id', id)
    .single();

  if (!thought) notFound();

  // Si no hay un plan de acción, no podemos ejecutar la misión
  if (!thought.plan_de_accion || !Array.isArray(thought.plan_de_accion)) {
    redirect('/dashboard');
  }

  return <MissionView thought={thought} />;
}
