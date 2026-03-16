'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'

// ── Types ────────────────────────────────────────────────────

export interface DaySummary {
  label: string       // "Mon"
  date: string        // "Mar 3"
  sessions: number
  avgScore: number
  isToday: boolean
}

interface WeeklySummaryProps {
  days: DaySummary[]
  weeklyAvg: number
  totalSessions: number
  activeDays: number
}

// ── Friction levels ──────────────────────────────────────────

function getDotStyle(score: number) {
  if (score >= 70) return { bg: 'bg-rose-500',    ring: 'ring-rose-200',    label: 'High' }
  if (score >= 50) return { bg: 'bg-amber-500',   ring: 'ring-amber-200',   label: 'Moderate' }
  if (score >= 30) return { bg: 'bg-indigo-500',  ring: 'ring-indigo-200',  label: 'Processing' }
  return                   { bg: 'bg-emerald-500', ring: 'ring-emerald-200', label: 'Fluid' }
}

function getLevelLabel(score: number, t: any): string {
  if (score >= 70) return t('levels.high')
  if (score >= 50) return t('levels.moderate')
  if (score >= 30) return t('levels.processing')
  if (score > 0) return t('levels.fluid')
  return t('levels.noData')
}

function getLevelColor(score: number): string {
  if (score >= 70) return 'text-rose-500'
  if (score >= 50) return 'text-amber-500'
  if (score >= 30) return 'text-indigo-500'
  if (score > 0) return 'text-emerald-500'
  return 'text-slate-300'
}

// ── Component ────────────────────────────────────────────────

export function WeeklySummary({
  days,
  weeklyAvg,
  totalSessions,
  activeDays,
}: WeeklySummaryProps) {
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Calendar size={16} className="text-indigo-500" aria-hidden="true" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          {t('yourWeek')}
        </h3>
      </div>

      {/* 7-day dots row */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {days.map((day, i) => {
          const hasData = day.sessions > 0
          const style = hasData ? getDotStyle(day.avgScore) : null

          return (
            <motion.div
              key={day.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col items-center gap-2 group"
            >
              {/* Day label */}
              <span className={`text-[11px] font-black uppercase tracking-wider ${
                day.isToday ? 'text-indigo-600' : hasData ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {day.label}
              </span>

              {/* Dot */}
              <div className="relative">
                {hasData ? (
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${style!.bg} 
                    flex items-center justify-center
                    ring-4 ${style!.ring}
                    transition-transform group-hover:scale-110
                    ${day.isToday ? 'shadow-lg' : ''}`}
                  >
                    <span className="text-white text-sm md:text-base font-black tabular-nums">
                      {day.avgScore}
                    </span>
                  </div>
                ) : (
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border-2 border-dashed
                    flex items-center justify-center
                    ${day.isToday ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <span className={`text-sm font-bold ${
                      day.isToday ? 'text-indigo-300' : 'text-slate-200'
                    }`}>
                      —
                    </span>
                  </div>
                )}

                {/* Today indicator */}
                {day.isToday ? (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                ) : null}
              </div>

              {/* Session count */}
              {hasData ? (
                <span className="text-[10px] font-bold text-slate-400">
                  {t('recorded', { count: day.sessions })}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-200">
                  {day.isToday ? t('today') : day.date}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {totalSessions > 0 ? (
          <>
            <span className="font-bold text-slate-400">
              {t('recorded', { count: totalSessions })}
            </span>
            <span className="text-slate-200">·</span>
            <span className={`font-black ${getLevelColor(weeklyAvg)}`}>
              {t('avg')} {weeklyAvg}
            </span>
            <span className={`font-bold ${getLevelColor(weeklyAvg)}`}>
              ({getLevelLabel(weeklyAvg, t)})
            </span>
            <span className="text-slate-200">·</span>
            <span className="font-bold text-slate-400">
              {t('daysCount', { count: activeDays })}
            </span>
          </>
        ) : (
          <span className="font-bold text-slate-300 italic">
            {t('startTracking')}
          </span>
        )}
      </div>
    </motion.div>
  )
}
