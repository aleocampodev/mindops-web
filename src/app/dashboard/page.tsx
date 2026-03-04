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

// ── Weekly data helpers ──────────────────────────────────────

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getStartOfWeek(weeksAgo: number): Date {
  const now = new Date()
  const day = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - day - (weeksAgo * 7))
  start.setHours(0, 0, 0, 0)
  return start
}

function buildWeeklyData(thoughts: { friction_score?: number; created_at: string }[]) {
  const weekStart = getStartOfWeek(0)
  const today = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)

    const dayThoughts = thoughts.filter(t => {
      const d = new Date(t.created_at)
      return d.getFullYear() === date.getFullYear()
        && d.getMonth() === date.getMonth()
        && d.getDate() === date.getDate()
    })

    const scores = dayThoughts
      .map(t => typeof t.friction_score === 'number' ? t.friction_score : null)
      .filter((s): s is number => s !== null)

    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    return {
      label: DAY_LABELS[date.getDay()],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgFriction: avg,
      sessions: dayThoughts.length,
      isToday: date.toDateString() === today.toDateString(),
    }
  })
}

function computeWeeklyAvg(thoughts: { friction_score?: number; created_at: string }[], weeksAgo: number): number {
  const start = getStartOfWeek(weeksAgo)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  const scores = thoughts
    .filter(t => {
      const d = new Date(t.created_at)
      return d >= start && d < end
    })
    .map(t => typeof t.friction_score === 'number' ? t.friction_score : null)
    .filter((s): s is number => s !== null)

  return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
}

function countWeekSessions(thoughts: { created_at: string }[], weeksAgo: number): number {
  const start = getStartOfWeek(weeksAgo)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return thoughts.filter(t => {
    const d = new Date(t.created_at)
    return d >= start && d < end
  }).length
}

function countActiveDays(thoughts: { created_at: string }[], weeksAgo: number): number {
  const start = getStartOfWeek(weeksAgo)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  const days = new Set(
    thoughts
      .filter(t => { const d = new Date(t.created_at); return d >= start && d < end })
      .map(t => new Date(t.created_at).toDateString())
  )
  return days.size
}

function findBestDay(thoughts: { friction_score?: number; created_at: string }[]): string | null {
  const weekData = buildWeeklyData(thoughts)
  const activeDays = weekData.filter(d => d.sessions > 0)
  if (!activeDays.length) return null
  const best = activeDays.reduce((a, b) => a.avgFriction <= b.avgFriction ? a : b)
  return DAY_NAMES[DAY_LABELS.indexOf(best.label)]
}