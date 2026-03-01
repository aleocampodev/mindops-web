import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/Header';
import { RhythmChart } from '@/components/dashboard/RhythmChart';
import { PerspectiveCard } from '@/components/dashboard/PerspectiveCard';
import { MomentumAnchor } from '@/components/dashboard/MomentumAnchor';
import { ThoughtGallery } from '@/components/dashboard/ThoughtGallery';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { MissionSidebar } from '@/components/dashboard/MissionSidebar';
import { calculateResilienceMetric } from '@/lib/dashboard/analytics';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.schema('mindops').from('profiles').select('*').eq('id', user.id).single();
  if (!profile?.telegram_id) redirect('/dashboard/pairing');

  const { data: thoughts } = await supabase
    .schema('mindops')
    .from('thoughts')
    .select('*')
    .eq('telegram_id', profile.telegram_id)
    .order('created_at', { ascending: false });

  const latestThought = thoughts?.[0];
  const isProteccion = latestThought?.modo_sistema === 'PROTECCION';

  // Dynamic metric calculation
  const resilience = calculateResilienceMetric(thoughts || []);

  const chartData = thoughts?.slice(0, 15).map((t: any) => ({
    hora: new Date(t.created_at).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true, 
      timeZone: 'America/New_York' 
    }),
    "Mental Load": t.friccion.includes('🔴') ? 95 : t.friccion.includes('🟡') ? 50 : 20,
    nivel: (t.friccion.includes('🔴') ? 'critical' : t.friccion.includes('🟡') ? 'dense' : 'fluid') as 'critical' | 'dense' | 'fluid',
  })).reverse();

  const energyLevel = chartData?.length ? 100 - (chartData[chartData.length - 1]["Mental Load"]) : 100;

  const displayName = profile?.first_name || "Partner";

  return (
    <main className={`min-h-screen transition-colors duration-700 ${
      isProteccion ? 'bg-[var(--color-surface-warm)]' : 'bg-[var(--color-surface)]'
    }`}>
      <div className="max-w-[1600px] mx-auto p-6 md:p-12">
        <DashboardHeader 
          firstName={displayName} 
          isProteccion={isProteccion} 
          energyLevel={energyLevel} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* Left column: Sidebar + Perspective */}
          <div className="lg:col-span-3 space-y-8">
            <MissionSidebar 
              isProteccion={isProteccion} 
              thoughtsCount={thoughts?.length || 0} 
              allThoughts={thoughts || []}
              firstName={displayName}
            />

            <PerspectiveCard 
                content={latestThought?.analisis_estrategico || "Talk to the bot to receive perspective."}
                isProteccion={isProteccion} 
              />
          </div>

          {/* Right column: Stats + Chart + Gallery */}
          <div className="lg:col-span-9 space-y-12">
            <QuickStats thoughts={thoughts || []} resilience={resilience} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RhythmChart data={chartData || []} isProteccion={isProteccion} />
              
            </div>
            
            <ThoughtGallery thoughts={thoughts || []} />
          </div>
        </div>
      </div>
    </main>
  );
}