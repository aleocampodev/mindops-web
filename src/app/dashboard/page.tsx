import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/Header';
import { RhythmChart } from '@/components/dashboard/RhythmChart';
import { PerspectiveCard } from '@/components/dashboard/PerspectiveCard';
import { MomentumAnchor } from '@/components/dashboard/MomentumAnchor';
import { ThoughtGallery } from '@/components/dashboard/ThoughtGallery';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { MissionSidebar } from '@/components/dashboard/MissionSidebar';

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
      <div className="max-w-[1600px] mx-auto p-6 md:p-12">
        <DashboardHeader 
          firstName={profile.first_name || 'Ale'} 
          isProteccion={isProteccion} 
          energyLevel={energyLevel} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* LADO IZQUIERDO: MISIÓN Y ESTADO */}
          <div className="lg:col-span-3 space-y-8">
            <MissionSidebar 
              isProteccion={isProteccion} 
              thoughtsCount={thoughts?.length || 0} 
              latestThought={latestThought}
            />
          </div>

          {/* LADO DERECHO: MÉTRICAS Y ACCIONES */}
          <div className="lg:col-span-9 space-y-12">
            <QuickStats thoughts={thoughts || []} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RhythmChart data={chartData || []} isProteccion={isProteccion} />
              
              <PerspectiveCard 
                content={latestThought?.analisis_estrategico || "Habla con el bot para recibir perspectiva."} 
                isProteccion={isProteccion} 
              />
            </div>

            <MomentumAnchor thoughts={thoughts || []} isProteccion={isProteccion} />
            
            <ThoughtGallery thoughts={thoughts || []} />
          </div>
        </div>
      </div>
    </main>
  );
}