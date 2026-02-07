'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { updateMissionStep } from '@/app/dashboard/actions';

export function MissionView({ thought }: any) {
  const [step, setStep] = useState(thought.current_step_index || 0);
  const [isPending, startTransition] = useTransition();
  
  // Parsing robusto del plan por si viene como string
  let plan = thought.plan_de_accion;
  if (typeof plan === 'string') {
    try { plan = JSON.parse(plan); } catch (e) { plan = []; }
  }
  
  const current = plan[step] || { tarea: 'Finalizado', hora: '' };

  const handleComplete = () => {
    startTransition(async () => {
      const nextStep = step + 1;
      const isFinal = nextStep >= plan.length;
      
      // Actualizamos Supabase (Server Action)
      await updateMissionStep(thought.id, nextStep, isFinal);
      
      if (!isFinal) setStep(nextStep);
      else window.location.href = '/dashboard'; // Al terminar, volvemos a la calma
    });
  };

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white flex flex-col p-6 overflow-hidden">
      {/* Indicador de Horizonte (Las tareas futuras) */}
      <div className="flex justify-center gap-2 mb-12 opacity-20">
        {plan.map((_: any, i: number) => (
          <div key={i} className={`h-1 w-8 rounded-full ${i === step ? 'bg-indigo-500 opacity-100' : 'bg-zinc-800'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, rotate: -5 }}
            className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[4rem] text-center space-y-10 relative overflow-hidden"
          >
            <div className="space-y-2">
              <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em]">Paso {step + 1} de {plan.length}</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-tight uppercase">
                {current.tarea}
              </h1>
            </div>

            <button
              onClick={handleComplete}
              disabled={isPending}
              className="cursor-pointer group relative w-full max-w-md mx-auto bg-white text-black py-6 rounded-[2rem] font-black text-2xl hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5"
            >
              {isPending ? <Loader2 className="animate-spin mx-auto" /> : 'LIBERAR CARGA'}
            </button>
            
            {/* El Horizonte: ¿Qué viene después? */}
            {plan[step + 1] && (
              <div className="pt-10 border-t border-white/5 opacity-40">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Próximo paso en {plan[step+1].hora}</p>
                <p className="text-lg font-bold uppercase italic">{plan[step+1].tarea}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
