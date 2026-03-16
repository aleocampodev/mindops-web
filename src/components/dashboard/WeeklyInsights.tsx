'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus, Calendar, Brain, Zap, Flame } from 'lucide-react'
import { useTranslations } from 'next-intl'


interface DayData {
  label: string       // "Mon", "Tue", etc.
  date: string        // "Mar 3"
  avgFriction: number // 0-100 average
  sessions: number    // how many thoughts that day
  isToday: boolean
}

interface WeeklyInsightsProps {
  days: DayData[]
  weeklyAvg: number
  prevWeekAvg: number
  totalSessions: number
  activeDays: number
  bestDay: string | null  // "Tuesday" — the day with lowest friction
}

function getFrictionColor(score: number): string {
  if (score >= 70) return 'bg-rose-500'
  if (score >= 50) return 'bg-amber-500'
  if (score >= 30) return 'bg-indigo-500'
  return 'bg-emerald-500'
}

function getFrictionLabel(score: number, t: any): string {
  if (score >= 70) return t('levels.high')
  if (score >= 50) return t('levels.moderate')
  if (score >= 30) return t('levels.processing')
  return t('levels.clear')
}


function getFrictionTextColor(score: number): string {
  if (score >= 70) return 'text-rose-500'
  if (score >= 50) return 'text-amber-500'
  if (score >= 30) return 'text-indigo-500'
  return 'text-emerald-500'
}

export function WeeklyInsights({
  days,
  weeklyAvg,
  prevWeekAvg,
  totalSessions,
  activeDays,
  bestDay,
}: WeeklyInsightsProps) {
  const t = useTranslations('Dashboard');
  const weeklyDelta = weeklyAvg - prevWeekAvg

  const isImproving = weeklyDelta < 0
  const isStable = Math.abs(weeklyDelta) <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-indigo-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {t('yourWeek')}
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
            {isStable ? t('stable') : isImproving ? t('pctBetter', { count: Math.abs(weeklyDelta) }) : t('pctHigher', { count: weeklyDelta })}
          </span>

        </div>
      </div>

      {/* 7-Day Heatmap Bar */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {days.map((day, i) => (
          <motion.div
            key={day.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
              day.isToday
                ? 'bg-slate-900 text-white shadow-lg'
                : day.sessions > 0
                  ? 'bg-slate-50 hover:bg-slate-100'
                  : 'bg-slate-50/50'
            }`}
          >
            {/* Day label */}
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              day.isToday ? 'text-white/60' : 'text-slate-400'
            }`}>
              {day.label}
            </span>

            {/* Friction dot / bar */}
            {day.sessions > 0 ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 rounded-lg ${getFrictionColor(day.avgFriction)} transition-all`}
                  style={{ height: `${Math.max(8, day.avgFriction * 0.5)}px` }}
                />
                <span className={`text-lg font-black italic tracking-tight ${
                  day.isToday ? 'text-white' : 'text-slate-900'
                }`}>
                  {day.avgFriction}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-2 rounded-lg bg-slate-200" />
                <span className={`text-lg font-black italic tracking-tight ${
                  day.isToday ? 'text-white/30' : 'text-slate-200'
                }`}>
                  —
                </span>
              </div>
            )}

            {/* Date */}
            <span className={`text-[9px] font-bold ${
              day.isToday ? 'text-white/40' : 'text-slate-300'
            }`}>
              {day.date}
            </span>

            {/* Session count badge */}
            {day.sessions > 0 && (
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                day.isToday
                  ? 'bg-white/10 text-white/60'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {t('recorded', { count: day.sessions })}
              </span>
            )}


            {/* Tooltip on hover */}
            {day.sessions > 0 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {getFrictionLabel(day.avgFriction, t)} · {t('recorded', { count: day.sessions })}
              </div>
            )}

          </motion.div>
        ))}
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Brain size={12} className="text-indigo-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('avg')}</span>
          </div>
          <span className={`text-2xl font-black italic tracking-tight ${getFrictionTextColor(weeklyAvg)}`}>
            {weeklyAvg || '—'}
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Zap size={12} className="text-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('active')}</span>
          </div>
          <span className="text-2xl font-black italic tracking-tight text-slate-900">
            {t('daysCount', { count: activeDays })}
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Flame size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('bestDay')}</span>
          </div>
          <span className="text-sm font-black italic tracking-tight text-emerald-600">
            {bestDay || '—'}
          </span>
        </div>
      </div>

    </motion.div>
  )
}
