'use client'
import { Card, AreaChart } from '@tremor/react';
import { Info, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function RhythmChart({ data, isProteccion }: { data: Record<string, unknown>[], isProteccion: boolean }) {
  const chartColors = isProteccion ? ["amber"] : ["indigo"];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-3"
    >
      <Card className="h-full rounded-[3.5rem] border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] bg-white/90 p-8 md:p-12 relative overflow-hidden group backdrop-blur-xl">
        {/* Background Decoration */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 -translate-y-12 translate-x-12 ${
          isProteccion ? 'text-amber-600' : 'text-indigo-600'
        }`}>
          <Activity size={256} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-2xl ${isProteccion ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <Activity size={20} />
              </div>
              <h3 className="text-[1.2rem] font-black tracking-widest uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
                Tu Ritmo de Calma
              </h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-md">
              Este mapa visual traduce tus desahogos en niveles de carga cognitiva. 
              <span className="block mt-1 text-slate-900 font-bold opacity-80">Identifica los picos de ruido para planificar tus próximas pausas.</span>
            </p>
          </div>
          
          <div className="flex-1 min-h-[18rem]">
            <AreaChart
              className="h-full w-full min-h-[18rem]"
              data={data}
              index="hora"
              categories={["Carga Mental"]}
              colors={chartColors}
              showYAxis={false}
              showLegend={false}
              curveType="natural"
              showGridLines={false}
              startEndOnly={false}
              showXAxis={true}
              showTooltip={true}
              autoMinValue={true}
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              <span className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isProteccion ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                Nivel de Inercia
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 group/info cursor-help">
              <Info size={14} className="transition-colors group-hover/info:text-indigo-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover/info:opacity-100 transition-opacity">
                Datos de las últimas 24h
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}