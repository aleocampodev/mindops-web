import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/Header';
import { RhythmChart } from '@/components/dashboard/RhythmChart';
import { PerspectiveCard } from '@/components/dashboard/PerspectiveCard';
import { MomentumAnchor } from '@/components/dashboard/MomentumAnchor';
import { ThoughtGallery } from '@/components/dashboard/ThoughtGallery';
import { QuickStats } from '@/components/dashboard/QuickStats';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile?.telegram_id) redirect('/dashboard/pairing');

  const { data: thoughts } = await supabase
    .from('thoughts')
    .select('*')
    .eq('telegram_id', profile.telegram_id)
    .order('created_at', { ascending: false });

  const latestThought = thoughts?.[0];
  const isProteccion = latestThought?.modo_sistema === 'PROTECCION';

  const chartData = thoughts?.slice(0, 15).map(t => ({
    hora: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    "Carga Mental": t.friccion.includes('🔴') ? 95 : t.friccion.includes('🟡') ? 50 : 20,
  })).reverse();

  const energyLevel = chartData?.length ? 100 - (chartData[chartData.length - 1]["Carga Mental"]) : 100;

  return (
    <main className={`min-h-screen transition-all duration-1000 ${
      isProteccion ? 'bg-[#FFF8F0]' : 'bg-[#FDFDFF]'
    }`}>
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        
        <DashboardHeader 
          firstName={profile.first_name || 'Ale'} 
          isProteccion={isProteccion} 
          energyLevel={energyLevel} 
        />

        <QuickStats thoughts={thoughts || []} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <RhythmChart data={chartData || []} isProteccion={isProteccion} />
          
          <PerspectiveCard 
            content={latestThought?.analisis_estrategico || "Habla con el bot para recibir perspectiva."} 
            isProteccion={isProteccion} 
          />

          {/* El listado de acciones también debería ser su propio componente */}
          <MomentumAnchor thoughts={thoughts || []} isProteccion={isProteccion} />
        </div>

        <ThoughtGallery thoughts={thoughts || []} />
      </div>
    </main>
  );
}