'use client'
import { Target, Shield, Zap, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MissionSidebarProps {
  isProteccion: boolean;
  thoughtsCount: number;
  latestThought?: any;
}

export function MissionSidebar({ isProteccion, thoughtsCount, latestThought }: MissionSidebarProps) {
  // Parsing robusto del plan por si viene como string
  let plan = latestThought?.plan_de_accion;
  if (typeof plan === 'string') {
    try { plan = JSON.parse(plan); } catch (e) { plan = null; }
  }
  const hasPlan = plan && Array.isArray(plan) && plan.length > 0;

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Target className="text-white" size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Tu Misión</h3>
          </div>

          <div className="space-y-4">
            <p className="text-xl font-black text-white leading-tight uppercase tracking-tighter italic">
              {isProteccion 
                ? "Recuperar la homeostasis biológica" 
                : "Optimizar el flujo de ejecución estratégica"}
            </p>
            <p className="text-xs text-white/70 font-medium leading-relaxed uppercase tracking-wider">
              {isProteccion 
                ? "Tu sistema está en modo ahorro. No fuerces la máquina, el éxito hoy es el descanso."
                : "La claridad es tu combustible. Mantén el ritmo y procesa cada pensamiento con intención."}
            </p>
          </div>

          {hasPlan && (
            <Link href={`/dashboard/mission/${latestThought.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors shadow-xl"
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

        {/* Elemntos decorativos */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={120} />
        </div>
      </motion.div>

      {/* ESTADO DEL SISTEMA */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[3rem] shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-xl ${isProteccion ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
             <Shield size={18} />
           </div>
           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Estado del Sistema</h4>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IA Vigilancia</span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-800 uppercase italic">Online</span>
            </span>
          </div>
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nivel de RAM</span>
            <span className="text-[10px] font-black text-slate-800 uppercase italic">{isProteccion ? '85% Saturado' : '15% Libre'}</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolo</span>
            <span className={`text-[10px] font-black uppercase italic ${isProteccion ? 'text-amber-600' : 'text-indigo-600'}`}>
              {isProteccion ? 'BIO-RECUPERACIÓN' : 'IMPULSO ALPHA'}
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
