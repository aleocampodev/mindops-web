'use client'
import { Card, DonutChart, BadgeDelta } from '@tremor/react';
import { Zap, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Thought {
  id: string;
  modo_sistema: string;
  friccion: string | null;
  status: string;
  created_at: string;
}

export function QuickStats({ thoughts }: { thoughts: Thought[] }) {
  // 1. Balance de Energía
  const total = thoughts.length || 1;
  const proteccion = thoughts.filter(t => t.modo_sistema === 'PROTECCION').length;
  const ejecucion = thoughts.filter(t => t.modo_sistema === 'EJECUCION').length;
  
  const energyData = [
    { name: 'Ejecución', value: Math.round((ejecucion / total) * 100) },
    { name: 'Protección', value: Math.round((proteccion / total) * 100) },
  ];

  return (
    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 backdrop-blur-md p-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Efficiency Score</span>
            </div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter">92%</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight">
              Desbloqueas crisis un <span className="text-emerald-500">20% más rápido</span> que ayer.
            </p>
          </div>
          <BadgeDelta deltaType="moderateIncrease" className="rounded-full px-4 py-1 font-black italic">
            +12 pts
          </BadgeDelta>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 backdrop-blur-md p-8 flex items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-slate-900 mb-4">
              <Activity size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Balance de Energía</span>
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
