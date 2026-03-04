import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/Header';
import { RhythmChart } from '@/components/dashboard/RhythmChart';
import { PerspectiveCard } from '@/components/dashboard/PerspectiveCard';
import { ThoughtGallery } from '@/components/dashboard/ThoughtGallery';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { MissionSidebar } from '@/components/dashboard/MissionSidebar';
import { FrictionHero } from '@/components/dashboard/FrictionHero';
import { WeeklyInsights } from '@/components/dashboard/WeeklyInsights';
import { calculateResilienceMetric } from '@/lib/dashboard/analytics';
import {
  buildWeeklyData,
  computeWeeklyAvg,
  countWeekSessions,
  countActiveDays,
  findBestDay,
} from '@/lib/dashboard/weekly';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Parallelize independent queries for better performance
  const [profileResult, thoughtsResult] = await Promise.all([
    supabase.schema('mindops').from('profiles').select('*').eq('id', user.id).single(),
    supabase.schema('mindops').from('thoughts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ]);

  const profile = profileResult.data;
  const thoughts = thoughtsResult.data;

  const latestThought = thoughts?.[0];
  const isProteccion = latestThought?.system_mode === 'PROTECCION';

  // Current friction score (latest session)
  const currentFriction: number = typeof latestThought?.friction_score === 'number'
    ? latestThought.friction_score
    : 0;

  if (!profile?.telegram_id) redirect('/dashboard/pairing');

  // Trend: compare latest vs average of all sessions
  const avgFriction = thoughts?.length
    ? Math.round(thoughts.reduce((s: number, t: { friction_score?: number }) => s + (typeof t.friction_score === 'number' ? t.friction_score : 20), 0) / thoughts.length)
    : 0;
  const frictionTrend = thoughts?.length ? currentFriction - avgFriction : 0;

  // Resilience metric
  const resilience = calculateResilienceMetric(thoughts || []);

  // Chart data — last 20 sessions, oldest first
  const chartData = thoughts?.slice(0, 20).map((t: { friction_score?: number; created_at: string }) => {
    const score: number = typeof t.friction_score === 'number' ? t.friction_score : 20;
    const nivel: 'fluido' | 'denso' | 'critico' = score >= 70 ? 'critico' : score >= 35 ? 'denso' : 'fluido';
    return {
      hora: new Date(t.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
      }),
      'Mental Load': score,
      nivel,
    };
  }).reverse() ?? [];

  const displayName = profile?.first_name || 'Partner';

  return (
    <main className={`min-h-screen transition-colors duration-700 ${
      isProteccion ? 'bg-[var(--color-surface-warm,#FFF8F0)]' : 'bg-[var(--color-surface,#FDFDFF)]'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pb-16">
        {/* ── Header ────────────────────────────────────────── */}
        <DashboardHeader firstName={displayName} isProteccion={isProteccion} />

        {/* ── Friction Hero — full width ─────────────────────── */}
        <div className="mt-6">
          <FrictionHero
            score={currentFriction}
            trend={frictionTrend}
            sessionCount={thoughts?.length ?? 0}
            isProteccion={isProteccion}
          />
        </div>

        {/* ── Weekly Insights — full width ────────────────────── */}
        <div className="mt-6">
          <WeeklyInsights
            days={buildWeeklyData(thoughts || [])}
            weeklyAvg={computeWeeklyAvg(thoughts || [], 0)}
            prevWeekAvg={computeWeeklyAvg(thoughts || [], 1)}
            totalSessions={countWeekSessions(thoughts || [], 0)}
            activeDays={countActiveDays(thoughts || [], 0)}
            bestDay={findBestDay(thoughts || [])}
          />
        </div>

        {/* ── Main content grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

          {/* Left column: Missions */}
          <div className="lg:col-span-4 space-y-6">
            <MissionSidebar
              isProteccion={isProteccion}
              thoughtsCount={thoughts?.length || 0}
              allThoughts={thoughts || []}
              firstName={displayName}
            />
          </div>

          {/* Right column: Chart → Stats → Perspective → Gallery */}
          <div className="lg:col-span-8 space-y-8">
            <RhythmChart data={chartData} isProteccion={isProteccion} />

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
