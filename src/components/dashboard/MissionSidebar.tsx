'use client'
import { Target, Shield, Zap, Star, ChevronRight, List, Eye, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface MissionSidebarProps {
  isProteccion: boolean;
  thoughtsCount: number;
  allThoughts: any[];
  firstName: string;
}

export function MissionSidebar({ isProteccion, thoughtsCount, allThoughts, firstName }: MissionSidebarProps) {
  const [showRecent, setShowRecent] = useState(false);

  // Filtramos las misiones que tienen plan de acción y están pendientes
  const missionsWithPlan = allThoughts.filter(t => {
    let plan = t.plan_de_accion;
    if (typeof plan === 'string') {
      try { plan = JSON.parse(plan); } catch (e) { plan = null; }
    }
    return plan && Array.isArray(plan) && plan.length > 0 && t.status === 'pendiente';
  }).slice(0, 3);

  const latestThought = missionsWithPlan[0];
  const hasPlan = missionsWithPlan.length > 0;

  return (
    <aside className="space-y-8">
      {/* CARD DE MISIÓN PRINCIPAL */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group ${
          isProteccion 
            ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
            : 'bg-gradient-to-br from-indigo-900 to-indigo-950'
        }`}
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Misión Operativa</h3>
            </div>
            {missionsWithPlan.length > 1 && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowRecent(!showRecent);
                }}
                className="relative z-20 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
              >
                <List size={18} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!showRecent ? (
              <motion.div
                key="latest"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <p className="text-xl font-black text-white leading-tight uppercase tracking-tighter italic">
                    {isProteccion 
                      ? "Recuperar la homeostasis biológica" 
                      : (latestThought?.accion_inmediata || "Optimizar el flujo estratégico")}
                  </p>
                  <p className="text-xs text-white/70 font-medium leading-relaxed uppercase tracking-wider">
                    {isProteccion 
                      ? "Tu sistema está en modo ahorro. No fuerces la máquina, el éxito hoy es el descanso."
                      : "La claridad es tu combustible. Mantén el ritmo y procesa cada pensamiento con intención."}
                  </p>
                </div>

                {hasPlan && (
                  <Link href={`/mission/${latestThought.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors shadow-xl"
                    >
                      Ejecutar Protocolo
                      <ChevronRight size={14} />
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Misiones Recientes</p>
                {missionsWithPlan.map((m) => (
                  <Link key={m.id} href={`/mission/${m.id}`}>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group flex items-center justify-between mb-2">
                       <p className="text-xs font-bold text-white max-w-[180px] truncate uppercase italic tracking-tighter">
                         {m.accion_inmediata}
                       </p>
                       <ChevronRight size={12} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
                <button 
                  onClick={() => setShowRecent(false)}
                  className="w-full text-center text-[9px] font-black text-white/40 uppercase hover:text-white transition-colors"
                >
                  Volver a la Principal
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase mb-1">Impacto Acumulado</p>
                <div className="flex items-center gap-1.5">
                  <Star className="text-amber-400 fill-amber-400" size={14} />
                  <span className="text-2xl font-black text-white italic">{thoughtsCount * 12} <span className="text-xs opacity-50">pts</span></span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/40 uppercase mb-1">Rango</p>
                <span className="text-xs font-black text-white uppercase italic tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {thoughtsCount > 10 ? 'ESTRATEGA' : 'OPERATIVO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Elemntos decorativos */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={120} />
        </div>
      </motion.div>

      {/* VIGILANCIA ACTIVA BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-md border border-slate-100 p-4 rounded-3xl flex items-center justify-center gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          Vigilancia Activa: El sistema monitorea tu inercia. Si te bloqueas, escucharemos tu voz.
        </span>
      </motion.div>

      {/* TU MIRADA */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[3rem] shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-xl ${isProteccion ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
             <Heart size={18} fill="currentColor" />
           </div>
           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Tu Mirada</h4>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enfoque</span>
            <span className="text-[10px] font-black text-slate-800 uppercase italic">{isProteccion ? 'Interior' : 'Agudo'}</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claridad</span>
            <span className="text-[10px] font-black text-slate-800 uppercase italic">{isProteccion ? 'En Proceso' : 'Alta'}</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perspectiva</span>
            <span className={`text-[10px] font-black uppercase italic ${isProteccion ? 'text-amber-600' : 'text-indigo-600'}`}>
              {isProteccion ? 'ESTRATÉGICA' : 'VITAL'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* MINI TIP / MOTIVACIÓN */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <Zap className="absolute -top-6 -right-6 text-slate-800 size-24 rotate-12" />
        <div className="relative z-10 space-y-4">
           <div className="flex items-center gap-2 text-amber-400">
             <Zap size={14} fill="currentColor" />
             <span className="text-[9px] font-black uppercase tracking-widest">Tip de Hoy</span>
           </div>
           <p className="text-white text-sm font-medium italic opacity-90 leading-relaxed">
             {isProteccion 
               ? "Cierra los ojos 5 minutos. Tu sistema procesará mejor el ruido en segundo plano." 
               : "Si una acción toma menos de 2 minutos, libérala ahora para recuperar momentum."}
           </p>
        </div>
      </motion.div>
    </aside>
  );
}
