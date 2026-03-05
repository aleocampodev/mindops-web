import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/Header';
import { PerspectiveCard } from '@/components/dashboard/PerspectiveCard';
import { ThoughtGallery } from '@/components/dashboard/ThoughtGallery';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { MissionSidebar } from '@/components/dashboard/MissionSidebar';
import { FrictionHero } from '@/components/dashboard/FrictionHero';
import { WeeklySummary } from '@/components/dashboard/WeeklySummary';
import { calculateResilienceMetric } from '@/lib/dashboard/analytics';
import {
  computeWeeklyAvg,
  countActiveDays,
  buildDaySummaries,
} from '@/lib/dashboard/weekly';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Parallelize independent queries
  const [profileResult, thoughtsResult] = await Promise.all([
    supabase.schema('mindops').from('profiles').select('*').eq('id', user.id).single(),
    supabase.schema('mindops').from('thoughts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const profile = profileResult.data;
  const thoughts = thoughtsResult.data;

  const latestThought = thoughts?.[0];
  const isProteccion = latestThought?.system_mode === 'PROTECTION';

  const currentFriction: number = typeof latestThought?.friction_score === 'number'
    ? latestThought.friction_score
    : 0;

  if (!profile?.telegram_id) redirect('/dashboard/pairing');

  // Trend
  const avgFriction = thoughts?.length
    ? Math.round(thoughts.reduce((s: number, t: { friction_score?: number }) => s + (typeof t.friction_score === 'number' ? t.friction_score : 20), 0) / thoughts.length)
    : 0;
  const frictionTrend = thoughts?.length ? currentFriction - avgFriction : 0;

  // Resilience
  const resilience = calculateResilienceMetric(thoughts || []);

  // Weekly summary data
  const allThoughts = thoughts || [];
  const daySummaries = buildDaySummaries(allThoughts);
  const weeklyAvg = computeWeeklyAvg(allThoughts, 0);
  const activeDays = countActiveDays(allThoughts, 0);
  const totalSessions = daySummaries.reduce((sum, d) => sum + d.sessions, 0);

  const displayName = profile?.first_name || 'Partner';

  return (
    <main className={`min-h-screen transition-colors duration-700 ${
      isProteccion ? 'bg-[var(--color-surface-warm,#FFF8F0)]' : 'bg-[var(--color-surface,#FDFDFF)]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pb-16">
        <DashboardHeader firstName={displayName} isProteccion={isProteccion} />

        {/* Friction Hero — snapshot of now */}
        <div className="mt-6">
          <FrictionHero
            score={currentFriction}
            trend={frictionTrend}
            sessionCount={thoughts?.length ?? 0}
            isProteccion={isProteccion}
          />
        </div>

        {/* Weekly Summary — how was the week at a glance */}
        <div className="mt-6">
          <WeeklySummary
            days={daySummaries}
            weeklyAvg={weeklyAvg}
            totalSessions={totalSessions}
            activeDays={activeDays}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-4 space-y-6">
            <MissionSidebar
              isProteccion={isProteccion}
              thoughtsCount={thoughts?.length || 0}
              allThoughts={thoughts || []}
              firstName={displayName}
            />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <QuickStats thoughts={thoughts || []} resilience={resilience} />

            <PerspectiveCard
              content={latestThought?.strategic_insight || 'Talk to the bot to receive perspective.'}
              isProteccion={isProteccion}
            />

            <ThoughtGallery thoughts={thoughts || []} />
          </div>
        </div>
      </div>
    </main>
  );
}
