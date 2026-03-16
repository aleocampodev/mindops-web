'use client'
import { Card, DonutChart, BadgeDelta } from '@tremor/react';
import { Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { ResilienceMetric } from '@/lib/dashboard/analytics';

interface Thought {
  id: string;
  system_mode: string;
  friction_score: number;
  status: string;
  created_at: string;
}

interface QuickStatsProps {
  thoughts: Thought[];
  resilience: ResilienceMetric;
}

export function QuickStats({ thoughts, resilience }: QuickStatsProps) {
  const t = useTranslations('Dashboard');
  // Energy balance split by system mode
  const total = thoughts.length || 1;
  const proteccion = thoughts.filter(t => t.system_mode === 'PROTECTION').length;
  const ejecucion = thoughts.filter(t => t.system_mode === 'EXECUTION').length;
  
  const energyData = [
    { name: t('execution'), value: Math.round((ejecucion / total) * 100) },
    { name: t('protection'), value: Math.round((proteccion / total) * 100) },
  ];

  // Determine Tremor delta type for the badge
  const deltaType = resilience.delta > 0 
    ? 'moderateIncrease' 
    : resilience.delta < 0 
      ? 'moderateDecrease' 
      : 'unchanged';

  // Resilience label color map
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
              <span className="text-[11px] font-black uppercase tracking-widest">{t('systemResilience')}</span>
            </div>
            <h4 className={`text-3xl font-black tracking-tighter italic ${labelColors[resilience.label]}`}>
              {t(`levels.${resilience.label.toLowerCase()}`)}
            </h4>
            <p className="text-xs font-semibold text-slate-400 leading-snug max-w-[220px] normal-case">
              {resilience.description}
            </p>
          </div>
          <div className="flex flex-col items-end justify-center gap-2 ml-4">
            <BadgeDelta
              deltaType={deltaType}
              className="rounded-full px-4 py-1.5 font-black italic scale-110 tabular"
            >
              {resilience.delta > 0 ? '+' : ''}{resilience.delta}%
            </BadgeDelta>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider text-right leading-tight">
              {t('vsPreviousCycle')}
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
              <span className="text-[11px] font-black uppercase tracking-widest">{t('energyBalance')}</span>
            </div>
            <div className="space-y-3">
               {energyData.map((item) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">{item.name}</span>
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
