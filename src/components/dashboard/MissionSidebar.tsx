'use client'
import { Target, Zap, Star, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

  // Misión principal: la más reciente que no esté completada
  const activeMission = allMissions.find(t => t.status !== 'completado');
  // Misiones recientes para la lista (máximo 5)
  const recentMissions = allMissions.slice(0, 5);
  const hasMissions = allMissions.length > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activado':
        return { label: 'Activa', color: 'bg-emerald-500' };
      case 'completado':
        return { label: 'Hecha', color: 'bg-slate-400' };
      default:
        return { label: 'Nueva', color: 'bg-indigo-500' };
    }
  };

  return (
    <aside className="space-y-6">
      {/* CARD DE MISIÓN PRINCIPAL */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-8 rounded-[3rem] shadow-2xl relative overflow-hidden ${ 
          isProteccion 
            ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
            : 'bg-gradient-to-br from-indigo-900 to-indigo-950'
        }`}
      >
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Target className="text-white" size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Misión Operativa</h3>
          </div>

          <div className="space-y-3">
            <p className="text-xl font-black text-white leading-tight uppercase tracking-tighter italic">
              {isProteccion 
                ? "Recuperar la homeostasis biológica" 
                : (activeMission?.accion_inmediata || "Sin misiones activas")}
            </p>
            <p className="text-xs text-white/70 font-medium leading-relaxed">
              {isProteccion 
                ? "Tu sistema está en modo ahorro. No fuerces la máquina, el éxito hoy es el descanso."
                : hasMissions 
                  ? "Toca una misión para ver su plan de acción completo."
                  : "Envía un mensaje al bot para generar tu primera misión."}
            </p>
          </div>

          {activeMission && (
            <Link href={`/mission/${activeMission.id}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors shadow-xl cursor-pointer"
              >
                Ejecutar Protocolo
                <ChevronRight size={14} />
              </motion.button>
            </Link>
          )}

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

        {/* Elementos decorativos */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Target size={120} />
        </div>
      </motion.div>

      {/* LISTA DE MISIONES RECIENTES */}
      {recentMissions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-6 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Últimas Misiones</span>
          </div>
          
          <div className="space-y-2">
            {recentMissions.map((m, i) => {
              const badge = getStatusBadge(m.status);
              return (
                <Link key={m.id} href={`/mission/${m.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="p-3.5 rounded-2xl hover:bg-slate-50 transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${badge.color}`} />
                      <p className="text-xs font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                        {m.accion_inmediata}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-300">
                        {badge.label}
                      </span>
                      <ChevronRight size={12} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* VIGILANCIA ACTIVA BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-md border border-slate-100 p-4 rounded-3xl flex items-center justify-center gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
          Vigilancia Activa: El sistema monitorea tu inercia.
        </span>
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
