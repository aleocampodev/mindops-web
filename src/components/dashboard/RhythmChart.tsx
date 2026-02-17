'use client'
import { Card } from '@tremor/react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  hora: string;
  'Mental Load': number;
  nivel: 'fluido' | 'denso' | 'critico';
}

const BAR_COLORS = {
  fluido:  { bar: 'bg-emerald-400', glow: 'shadow-emerald-200', label: 'Fluid' },
  denso:   { bar: 'bg-amber-400',   glow: 'shadow-amber-200',   label: 'Dense' },
  critico: { bar: 'bg-rose-400',    glow: 'shadow-rose-200',    label: 'Critical' },
};

export function RhythmChart({ data, isProteccion }: { data: ChartDataPoint[], isProteccion: boolean }) {
  const maxValue = 100;
  const hasData = data.length > 0;
  
  // Tendencia: compara último vs promedio
  const lastValue = hasData ? data[data.length - 1]['Mental Load'] : 0;
  const avgValue = hasData ? Math.round(data.reduce((sum, d) => sum + d['Mental Load'], 0) / data.length) : 0;
  const trending = lastValue <= avgValue ? 'mejorando' : 'subiendo';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-3"
    >
      <Card className="h-full rounded-[3.5rem] border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] bg-white/90 p-8 md:p-10 relative overflow-hidden group backdrop-blur-xl">
        {/* Background Decoration */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 -translate-y-12 translate-x-12 ${
          isProteccion ? 'text-amber-600' : 'text-indigo-600'
        }`}>
          <Activity size={256} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-2xl ${isProteccion ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  <Activity size={20} />
                </div>
                <h3 className="text-[1.1rem] font-black tracking-widest uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
                  Your Calm Rhythm
                </h3>
              </div>
              {hasData && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  trending === 'mejorando' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-rose-50 text-rose-600'
                }`}>
                  {trending === 'mejorando' ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {trending === 'mejorando' ? 'Decreasing' : 'Increasing'}
                </div>
              )}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium max-w-md">
              Each bar shows the mental friction level of each log. 
              <span className="text-slate-600 font-bold"> Lower bars = greater calm.</span>
            </p>
          </div>
          
          {/* Bar Chart */}
          <div className="flex-1 min-h-[20rem]">
            {!hasData ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-300 text-sm font-medium italic">
                  Send a message to the bot to see your first log.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Y-axis labels */}
                <div className="flex-1 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                    <div className="border-b border-dashed border-slate-100 relative">
                      <span className="absolute -left-1 -top-2 text-[8px] font-bold text-slate-300">100</span>
                    </div>
                    <div className="border-b border-dashed border-slate-100 relative">
                      <span className="absolute -left-1 -top-2 text-[8px] font-bold text-slate-300">50</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-1 -top-2 text-[8px] font-bold text-slate-300">0</span>
                    </div>
                  </div>

                  {/* Bars Container */}
                  <div className="absolute inset-0 flex items-end justify-start gap-2 sm:gap-3 pl-6 pr-1">
                    {/* Ghost Bars + Real Bars */}
                    {Array.from({ length: 15 }).map((_, i) => {
                      const point = data[i];
                      const isGhost = !point;
                      
                      if (isGhost) {
                        return (
                          <div 
                            key={`ghost-${i}`}
                            className="flex-1 flex flex-col items-center justify-end h-full max-w-[3rem]"
                          >
                            <div className="w-full h-full bg-slate-50/40 rounded-t-xl border border-dashed border-slate-100/50" />
                          </div>
                        );
                      }

                      const nivel = point.nivel || 'fluido';
                      const colors = BAR_COLORS[nivel];
                      const heightPercent = (point['Mental Load'] / maxValue) * 100;
                      
                      return (
                        <motion.div
                          key={`${point.hora}-${i}`}
                          className="flex-1 flex flex-col items-center justify-end h-full max-w-[3rem] group/bar"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.05 * i, duration: 0.4, ease: 'easeOut' }}
                          style={{ transformOrigin: 'bottom' }}
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity mb-1 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold rounded-lg whitespace-nowrap pointer-events-none z-20">
                            {colors.label} · {point['Mental Load']}%
                          </div>
                          
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t-xl ${colors.bar} shadow-sm hover:shadow-lg hover:${colors.glow} transition-all duration-200 cursor-default min-h-[4px] z-10`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex items-center justify-start gap-2 sm:gap-3 pl-6 pr-1 mt-2 border-t border-slate-100 pt-2">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const point = data[i];
                    return (
                      <div key={`label-${i}`} className="flex-1 max-w-[3rem]">
                        <p className="text-[7px] sm:text-[8px] font-bold text-slate-300 text-center truncate">
                          {point ? point.hora : '--:--'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Legend */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-emerald-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Fluid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-amber-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Dense</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-rose-400" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Critical</span>
              </div>
            </div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-300">
              {data.length} logs
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}