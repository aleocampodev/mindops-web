'use client'

import { motion } from 'framer-motion'
import { Calendar, TrendingDown, TrendingUp, Minus, Activity, Flame, Zap, BarChart3 } from 'lucide-react'
import { useTranslations } from 'next-intl'


// ── Types ────────────────────────────────────────────────────

interface SessionPoint {
  id: string
  score: number
  timestamp: string   // ISO string
  dayLabel: string    // "Tue"
  timeLabel: string   // "2:30 PM"
}

interface DaySummary {
  label: string       // "Mon"
  date: string        // "Mar 3"
  sessions: number
  avgScore: number
  isToday: boolean
}

interface WeeklyTimelineProps {
  sessions: SessionPoint[]
  days: DaySummary[]
  weeklyAvg: number
  prevWeekAvg: number
  peakSession: { score: number; label: string } | null
  lowestSession: { score: number; label: string } | null
  totalSessions: number
  activeDays: number
}

// ── Friction zones ───────────────────────────────────────────

const ZONES = [
  { min: 0,  max: 35, label: 'Fluid',    color: 'emerald', bg: 'bg-emerald-50',  text: 'text-emerald-600', bar: 'bg-emerald-400' },
  { min: 35, max: 50, label: 'Processing', color: 'blue',  bg: 'bg-blue-50',     text: 'text-blue-600',    bar: 'bg-blue-400' },
  { min: 50, max: 70, label: 'Moderate',  color: 'amber',  bg: 'bg-amber-50',    text: 'text-amber-600',   bar: 'bg-amber-500' },
  { min: 70, max: 100,label: 'High Load', color: 'rose',   bg: 'bg-rose-50',     text: 'text-rose-600',    bar: 'bg-rose-500' },
] as const

function getLevelLabel(score: number, t: any): string {
  if (score >= 70) return t('levels.high')
  if (score >= 50) return t('levels.moderate')
  if (score >= 30) return t('levels.processing')
  if (score > 0) return t('levels.fluid')
  return t('levels.noData')
}

function getZone(score: number) {

  return ZONES.find(z => score >= z.min && score < z.max) ?? ZONES[ZONES.length - 1]
}

// ── Component ────────────────────────────────────────────────

export function WeeklyTimeline({
  sessions,
  days,
  weeklyAvg,
  prevWeekAvg,
  peakSession,
  lowestSession,
  totalSessions,
  activeDays,
}: WeeklyTimelineProps) {
  const t = useTranslations('Dashboard');
  const delta = weeklyAvg - prevWeekAvg

  const isImproving = delta < 0
  const isStable = Math.abs(delta) <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-4 md:px-10 md:pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-indigo-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {t('thisWeekFriction')}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isStable ? (
            <Minus size={14} className="text-slate-400" />
          ) : isImproving ? (
            <TrendingDown size={14} className="text-emerald-500" />
          ) : (
            <TrendingUp size={14} className="text-rose-400" />
          )}
          <span className={`text-xs font-black ${
            isStable ? 'text-slate-400' : isImproving ? 'text-emerald-500' : 'text-rose-400'
          }`}>
            {totalSessions === 0
              ? t('noSessions')
              : isStable
                ? t('stable')
                : isImproving
                  ? t('ptsBetter', { count: Math.abs(delta) })
                  : t('ptsHigher', { count: delta })}
          </span>

        </div>
      </div>

      {/* ── Timeline Chart ──────────────────────────────────── */}
      <div className="px-8 md:px-10 pb-2">
        {/* Zone background + bars */}
        <div className="relative h-52 border border-slate-100 rounded-2xl overflow-hidden">
          {/* Zone backgrounds */}
          {ZONES.map(zone => {
            const bottom = zone.min
            const height = zone.max - zone.min
            return (
              <div
                key={zone.label}
                className={`absolute left-0 right-0 ${zone.bg} opacity-40`}
                style={{
                  bottom: `${bottom}%`,
                  height: `${height}%`,
                }}
              />
            )
          })}

          {/* Zone labels (right edge) */}
          <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none z-10">
            {[...ZONES].reverse().map(zone => {
              const zoneLabel = zone.label === 'Fluid' ? t('levels.fluid') : 
                                zone.label === 'Processing' ? t('levels.processing') :
                                zone.label === 'Moderate' ? t('levels.moderate') :
                                t('levels.high');
              return (
                <span key={zone.label} className={`text-[8px] font-bold ${zone.text} opacity-60`}>
                  {zoneLabel}
                </span>
              )
            })}
          </div>


          {/* Threshold lines */}
          {[35, 50, 70].map(threshold => (
            <div
              key={threshold}
              className="absolute left-0 right-0 border-t border-dashed border-slate-200"
              style={{ bottom: `${threshold}%` }}
            />
          ))}

          {/* Session bars */}
          {totalSessions > 0 ? (
            <div className="absolute inset-0 flex items-end justify-center gap-1 px-4 pb-1 z-10">
              {sessions.map((s, i) => {
                const zone = getZone(s.score)
                return (
                  <motion.div
                    key={s.id}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, s.score)}%` }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 120 }}
                    className={`relative group flex-1 max-w-14 ${zone.bar} rounded-t-lg cursor-default`}
                  >
                    {/* Score label on top */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600">
                      {s.score}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {s.dayLabel} {s.timeLabel} · {zone.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-sm font-bold text-slate-300 italic">
                {t('talkToBot')}
              </p>
            </div>

          )}
        </div>

        {/* X-axis: day labels */}
        <div className="grid grid-cols-7 mt-2 mb-4">
          {days.map(day => (
            <div key={day.label} className="flex flex-col items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider ${
                day.isToday ? 'text-indigo-600' : day.sessions > 0 ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {day.label}
              </span>
              <span className={`text-[9px] font-bold ${
                day.isToday ? 'text-indigo-400' : 'text-slate-300'
              }`}>
                {day.date}
              </span>
              {day.sessions > 0 ? (
                <span className="text-[8px] font-black text-slate-400 mt-0.5">
                  {day.sessions}s · avg {day.avgScore}
                </span>
              ) : (
                <span className="text-[8px] font-bold text-slate-200 mt-0.5">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100">
        <StatCell
          icon={<BarChart3 size={12} className="text-indigo-500" />}
          label={t('sessions')}
          value={totalSessions.toString()}
          sub={t('daysCount', { count: activeDays })}
        />
        <StatCell
          icon={<Activity size={12} className="text-amber-500" />}
          label={t('avg')}
          value={weeklyAvg > 0 ? weeklyAvg.toString() : '—'}
          sub={weeklyAvg > 0 ? getLevelLabel(weeklyAvg, t) : t('levels.noData')}
          valueColor={weeklyAvg > 0 ? getZone(weeklyAvg).text : 'text-slate-300'}
        />
        <StatCell
          icon={<Flame size={12} className="text-rose-500" />}
          label={t('peak')}
          value={peakSession ? peakSession.score.toString() : '—'}
          sub={peakSession ? peakSession.label : t('noSessionsShort')}
          valueColor="text-rose-500"
        />
        <StatCell
          icon={<Zap size={12} className="text-emerald-500" />}
          label={t('lowest')}
          value={lowestSession ? lowestSession.score.toString() : '—'}
          sub={lowestSession ? lowestSession.label : t('noSessionsShort')}
          valueColor="text-emerald-500"
        />
      </div>

    </motion.div>
  )
}

// ── Sub-component ────────────────────────────────────────────
// Follows `patterns-children-over-render-props` — simple props, no booleans

function StatCell({
  icon,
  label,
  value,
  sub,
  valueColor = 'text-slate-900',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  valueColor?: string
}) {
  return (
    <div className="bg-white p-5 flex flex-col items-center text-center">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>
      </div>
      <span className={`text-2xl font-black italic tracking-tight ${valueColor}`}>
        {value}
      </span>
      <span className="text-[9px] font-bold text-slate-300 mt-1">{sub}</span>
    </div>
  )
}
