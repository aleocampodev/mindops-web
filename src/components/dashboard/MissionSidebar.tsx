'use client'
import { Target, Zap, Star, ChevronRight, List, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface MissionSidebarProps {
  isProteccion: boolean;
  thoughtsCount: number;
  allThoughts: any[];
  firstName: string;
}

export function MissionSidebar({ isProteccion, thoughtsCount, allThoughts, firstName }: MissionSidebarProps) {

  // Filtramos todas las misiones que tienen plan de acción (sin importar status)
  const allMissions = allThoughts.filter(t => {
    let plan = t.plan_de_accion;
    if (typeof plan === 'string') {
      try { plan = JSON.parse(plan); } catch (e) { plan = null; }
    }
    return plan && Array.isArray(plan) && plan.length > 0;
  });

  // Misiones activas (no completadas)
  const activeMissions = allMissions.filter(t => t.status !== 'completado');
  const hasMissions = activeMissions.length > 0;
  const displayMissions = activeMissions.slice(0, 3);
  const remainingCount = Math.max(0, activeMissions.length - 3);

  return (
    <aside className="space-y-6">
      {/* SECCIÓN DE MISIONES ACTIVAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Target size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Misiones Activas</span>
          </div>
          {activeMissions.length > 3 && (
            <Link href="/mission">
              <span className="text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-400 cursor-pointer transition-colors">
                Ver Todas (+{remainingCount})
              </span>
            </Link>
          )}
        </div>

        {hasMissions ? (
          <div className="space-y-3">
            {displayMissions.map((mission, idx) => (
              <motion.div 
                key={mission.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/mission/${mission.id}`}>
                  <div className={`group p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${
                    idx === 0 
                      ? 'bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-400 shadow-xl scale-[1.02]' 
                      : 'bg-white border-slate-100 hover:border-indigo-200'
                  }`}>
                    <div className="relative z-10 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                          idx === 0 ? 'text-indigo-200' : 'text-slate-400'
                        }`}>
                          {idx === 0 ? 'Prioridad de Ejecución' : `Misión ${activeMissions.length - idx}`}
                        </span>
                        <Rocket size={14} className={`${idx === 0 ? 'text-white' : 'text-slate-300'} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
                      </div>
                      <p className={`text-sm font-black italic uppercase leading-tight tracking-tighter ${
                        idx === 0 ? 'text-white' : 'text-slate-900'
                      }`}>
                        {mission.accion_inmediata}
                      </p>
                    </div>
                    {idx === 0 && (
                      <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                        <Target size={80} className="text-white" />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-200 rounded-[2rem] text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              No hay misiones activas
            </p>
          </div>
        )}

        {/* Impacto y Rango (Simplificado) */}
        <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-white rounded-[2rem] flex justify-between items-center border border-slate-100 shadow-sm">
          <div>
            <p className="text-[8px] font-black text-indigo-400 uppercase mb-0.5 tracking-wider">Impacto en Bienestar</p>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-black italic text-slate-900">{thoughtsCount * 12}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">u. alivio</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 tracking-wider">Rango Actual</p>
            <span className="text-[10px] font-black text-indigo-600 uppercase italic bg-indigo-50 px-3 py-1 rounded-full">
              {thoughtsCount > 10 ? 'ESTRATEGA' : 'OPERATIVO'}
            </span>
          </div>
        </div>
      </div>

      {/* VIGILANCIA ACTIVA BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-md border border-slate-100 p-4 rounded-3xl flex items-center justify-center gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          Vigilancia Activa: Sistema operativo
        </span>
      </motion.div>

      {/* MINI TIP / MOTIVACIÓN */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-indigo-600 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group"
      >
        <Zap className="absolute -top-6 -right-6 text-indigo-500 size-24 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
        <div className="relative z-10 space-y-4">
           <div className="flex items-center gap-2 text-indigo-200">
             <Zap size={14} fill="currentColor" />
             <span className="text-[9px] font-black uppercase tracking-widest">Enfoque</span>
           </div>
           <p className="text-white text-sm font-medium italic opacity-90 leading-relaxed">
             {isProteccion 
               ? "Cierra los ojos 5 minutos. Tu sistema procesará mejor el ruido." 
               : "Si toma menos de 2 minutos, libérala ahora."}
           </p>
        </div>
      </motion.div>
    </aside>
  );
}
