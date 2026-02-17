'use client'
import { Card, DonutChart, BadgeDelta } from '@tremor/react';
import { Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ResilienceMetric } from '@/lib/dashboard/analytics';

interface Thought {
  id: string;
  modo_sistema: string;
  friccion: string | null;
  status: string;
  created_at: string;
}

interface QuickStatsProps {
  thoughts: Thought[];
  resilience: ResilienceMetric;
}

export function QuickStats({ thoughts, resilience }: QuickStatsProps) {
  // 1. Balance de Energía
  const total = thoughts.length || 1;
  const proteccion = thoughts.filter(t => t.modo_sistema === 'PROTECCION').length;
  const ejecucion = thoughts.filter(t => t.modo_sistema === 'EJECUCION').length;
  
  const energyData = [
    { name: 'Execution', value: Math.round((ejecucion / total) * 100) },
    { name: 'Protection', value: Math.round((proteccion / total) * 100) },
  ];

  // Determinar el tipo de delta para Tremor
  const deltaType = resilience.delta > 0 
    ? 'moderateIncrease' 
    : resilience.delta < 0 
      ? 'moderateDecrease' 
      : 'unchanged';

  // Mapeo de colores para labels de resiliencia
  const labelColors = {
    OPTIMAL: 'text-emerald-500',
    STABLE: 'text-indigo-600',
    VULNERABLE: 'text-rose-500',
    PENDING: 'text-slate-400'
  };

  return (
    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 backdrop-blur-md p-8 flex items-center justify-between group hover:bg-white transition-colors h-full">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Resilience</span>
            </div>
            <h4 className={`text-3xl font-black tracking-tighter italic ${labelColors[resilience.label]}`}>
              {resilience.label}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight max-w-[180px]">
              {resilience.description}
            </p>
          </div>
          <div className="flex flex-col items-end justify-center gap-2 ml-4">
            <BadgeDelta 
              deltaType={deltaType} 
              className="rounded-full px-4 py-1.5 font-black italic scale-110"
            >
              {resilience.delta > 0 ? '+' : ''}{resilience.delta}%
            </BadgeDelta>
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-right leading-tight">
              vs Previous <br/> Cycle
            </span>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 backdrop-blur-md p-8 flex items-center gap-8 h-full">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-slate-900 mb-4">
              <Activity size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Energy Balance</span>
            </div>
            <div className="space-y-3">
               {energyData.map((item) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                    <span className="text-sm font-black text-slate-800">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
          <DonutChart
            className="h-24 w-24"
            data={energyData}
            category="value"
            index="name"
            colors={["indigo", "amber"]}
            showLabel={false}
          />
        </Card>
      </motion.div>
    </div>
  );
}
