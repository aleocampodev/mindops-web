'use client'
import { motion } from 'framer-motion';
import { Brain, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface FrictionHeroProps {
  score: number;       // 0-100, current friction score
  trend: number;       // delta vs session average (positive = more friction)
  sessionCount: number;
  isProteccion: boolean;
}

const RADIUS = 82;
const CX = 110;
const CY = 105;
const CIRCUMFERENCE = Math.PI * RADIUS; // semi-circle arc length ≈ 257.6

function getState(score: number, isProteccion: boolean) {
  if (isProteccion) {
    return {
      label: 'Active Pause',
      sub: 'Your system detected critical overload. Rest is the mission.',
      color: 'text-amber-400',
      stroke: '#fbbf24',
      bg: 'from-amber-950/80 to-slate-900',
      badge: 'bg-amber-500/20 text-amber-400',
    };
  }
  if (score <= 30) return {
    label: 'Clear Mind',
    sub: 'Low cognitive friction. You are in peak execution window.',
    color: 'text-emerald-400',
    stroke: '#34d399',
    bg: 'from-emerald-950/60 to-slate-900',
    badge: 'bg-emerald-500/20 text-emerald-400',
  };
  if (score <= 60) return {
    label: 'Processing Load',
    sub: 'Moderate mental friction. Monitor your energy and pace yourself.',
    color: 'text-amber-400',
    stroke: '#fbbf24',
    bg: 'from-amber-950/60 to-slate-900',
    badge: 'bg-amber-500/20 text-amber-400',
  };
  return {
    label: 'High Friction',
    sub: 'Your system is under cognitive strain. Consider an active pause.',
    color: 'text-rose-400',
    stroke: '#fb7185',
    bg: 'from-rose-950/60 to-slate-900',
    badge: 'bg-rose-500/20 text-rose-400',
  };
}

export function FrictionHero({ score, trend, sessionCount, isProteccion }: FrictionHeroProps) {
  const state = getState(score, isProteccion);
  const safeScore = Math.max(0, Math.min(100, score));
  const fillLength = (safeScore / 100) * CIRCUMFERENCE;
  const arcPath = `M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`;

  const TrendIcon = trend < 0 ? TrendingDown : trend > 0 ? TrendingUp : Minus;
  const trendLabel = trend < 0
    ? `${Math.abs(trend)} pts below your average — improving`
    : trend > 0
    ? `${Math.abs(trend)} pts above your average — watch out`
    : 'Steady — matching your average';

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${state.bg} via-slate-900 p-8 md:p-10`}
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Gauge */}
        <div className="relative flex-shrink-0">
          <svg width={CX * 2} height={CY + 16} viewBox={`0 0 ${CX * 2} ${CY + 16}`}>
            {/* Track */}
            <path
              d={arcPath}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Glow layer */}
            <motion.path
              d={arcPath}
              fill="none"
              stroke={state.stroke}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE}`}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE - fillLength }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
              style={{ filter: 'blur(6px)', opacity: 0.3 }}
            />
            {/* Main arc */}
            <motion.path
              d={arcPath}
              fill="none"
              stroke={state.stroke}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE}`}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE - fillLength }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>

          {/* Score centered below arc */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className={`text-6xl font-black tabular-nums leading-none ${state.color}`}
            >
              {safeScore}
            </motion.span>
            <span className="text-white/25 text-[9px] font-black uppercase tracking-[0.3em] mt-1">
              friction score
            </span>
          </div>
        </div>

        {/* Text info */}
        <div className="space-y-5 text-center md:text-left flex-1">
          <div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.35em] mb-2 flex items-center gap-2 justify-center md:justify-start">
              <Brain size={10} />
              Cognitive Load · Now
            </p>
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl md:text-5xl font-black italic tracking-tight leading-none ${state.color}`}
            >
              {state.label}
            </motion.h2>
          </div>

          <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
            {state.sub}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {sessionCount > 0 && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider ${state.badge}`}>
                <TrendIcon size={12} />
                {trendLabel}
              </div>
            )}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/5 text-white/40">
              {sessionCount} session{sessionCount !== 1 ? 's' : ''} recorded
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
