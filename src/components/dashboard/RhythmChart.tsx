'use client'
import { Card } from '@tremor/react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';


interface ChartDataPoint {
  hora: string;
  'Mental Load': number;
  nivel: 'fluido' | 'denso' | 'critico';
}

const BAR_COLORS = {
  fluido:  { bar: 'bg-emerald-400', glow: 'shadow-emerald-200', labelKey: 'levels.fluid' },
  denso:   { bar: 'bg-amber-400',   glow: 'shadow-amber-200',   labelKey: 'levels.dense' },
  critico: { bar: 'bg-rose-400',    glow: 'shadow-rose-200',    labelKey: 'levels.critical' },
};


export function RhythmChart({ data, isProteccion }: { data: ChartDataPoint[], isProteccion: boolean }) {
  const t = useTranslations('Dashboard');
  const maxValue = 100;

  const hasData = data.length > 0;

  const lastValue = hasData ? data[data.length - 1]['Mental Load'] : 0;
  const avgValue = hasData ? Math.round(data.reduce((sum, d) => sum + d['Mental Load'], 0) / data.length) : 0;
  const trending = lastValue <= avgValue ? 'mejorando' : 'subiendo';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <Card className="rounded-[2.5rem] border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07)] bg-white/90 p-8 md:p-10 relative overflow-hidden group backdrop-blur-xl">
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 -translate-y-12 translate-x-12 ${
          isProteccion ? 'text-amber-600' : 'text-indigo-600'
        }`}>
          <Activity size={256} strokeWidth={1} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-2xl ${isProteccion ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-[1rem] font-black tracking-widest uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
                  {t('calmRhythm')}
                </h3>
                <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                  {t.rich('calmRhythmSub', {
                    bold: (chunks) => <span className="text-slate-600 font-bold">{t('lowerCalmer')}</span>
                  })}
                </p>
              </div>

            </div>
            {hasData && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                trending === 'mejorando'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}>
                {trending === 'mejorando' ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                {trending === 'mejorando' ? t('improving') : t('rising')}
              </div>

            )}
          </div>

          {/* Chart area — explicit height so bars render */}
          {!hasData ? (
            <div className="h-[240px] flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
                <Activity size={24} className="text-slate-300" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-slate-400 text-sm font-semibold">{t('noLogs')}</p>
                <p className="text-slate-300 text-xs">{t('sendBotLog')}</p>
              </div>

            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Bars container — fixed height, relative so absolute children work */}
              <div className="relative h-[240px]">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[100, 75, 50, 25, 0].map((val) => (
                    <div key={val} className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-slate-200 w-6 text-right flex-shrink-0">{val}</span>
                      <div className="flex-1 border-t border-dashed border-slate-100" />
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-start gap-1.5 sm:gap-2 pl-8 pr-1 pb-0">
                  {Array.from({ length: Math.max(data.length, 15) }).map((_, i) => {
                    const point = data[i];
                    const isGhost = !point;

                    if (isGhost) {
                      return (
                        <div
                          key={`ghost-${i}`}
                          className="flex-1 flex flex-col items-center justify-end h-full max-w-[3rem]"
                        >
                          <div className="w-full rounded-t-lg bg-slate-50/60 border border-dashed border-slate-100/50" style={{ height: '8%' }} />
                        </div>
                      );
                    }

                    const nivel = point.nivel || 'fluido';
                    const colors = BAR_COLORS[nivel];
                    const heightPercent = Math.max((point['Mental Load'] / maxValue) * 100, 4);

                    return (
                      <motion.div
                        key={`${point.hora}-${i}`}
                        className="flex-1 flex flex-col items-center justify-end h-full max-w-[3rem] group/bar"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.05 * i, duration: 0.4, ease: 'easeOut' }}
                        style={{ transformOrigin: 'bottom' }}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity mb-1 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold rounded-lg whitespace-nowrap pointer-events-none z-20">
                          {t(colors.labelKey)} · {point['Mental Load']}%
                        </div>

                        {/* Bar */}
                        <div
                          className={`w-full rounded-t-lg ${colors.bar} shadow-sm hover:shadow-lg hover:${colors.glow} transition-all duration-200 cursor-default z-10`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis */}
              <div className="flex items-center justify-start gap-1.5 sm:gap-2 pl-8 pr-1 mt-1 pt-2 border-t border-slate-100">
                {Array.from({ length: Math.max(data.length, 15) }).map((_, i) => {
                  const point = data[i];
                  return (
                    <div key={`label-${i}`} className="flex-1 max-w-[3rem]">
                      <p className="text-[7px] sm:text-[8px] font-bold text-slate-300 text-center truncate">
                        {point ? point.hora : '—'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4">
              {Object.entries(BAR_COLORS).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${val.bar}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t(val.labelKey)}</span>
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('logsCount', { count: data.length })}
            </span>

          </div>
        </div>
      </Card>
    </motion.div>
  );
}