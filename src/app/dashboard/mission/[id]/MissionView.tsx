'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Target } from 'lucide-react';
import { useState, useTransition } from 'react';
import { updateMissionStep } from '../../actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function MissionView({ thought }: any) {
  const router = useRouter();
  const [step, setStep] = useState(thought.current_step_index || 0);
  const [isPending, startTransition] = useTransition();
  
  // Parsing robusto del plan por si viene como string
  let plan = thought.plan_de_accion;
  if (typeof plan === 'string') {
    try { plan = JSON.parse(plan); } catch (e) { plan = []; }
  }
  
  // Seguridad por si el índice es mayor al plan o el plan está vacío
  const current = (plan && plan.length > 0) 
    ? (plan[step] || plan[plan.length - 1])
    : { tarea: 'Sin tareas disponibles', hora: '' };

  const handleComplete = () => {
    startTransition(async () => {
      const nextStep = step + 1;
      const isFinal = nextStep >= plan.length;
      
      // Actualizamos Supabase (Server Action)
      const result = await updateMissionStep(thought.id, nextStep, isFinal);
      
      if (result.success) {
        if (!isFinal) {
          setStep(nextStep);
        } else {
          // Al terminar, volvemos al dashboard
          router.push('/dashboard'); 
        }
      } else {
        alert("Error al actualizar la misión. Por favor, intenta de nuevo.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white flex flex-col p-6 overflow-hidden font-sans">
      {/* Header de navegación rápida */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
            <ArrowLeft size={14} />
            Abortar Misión
        </Link>
        <div className="flex items-center gap-2">
            <Target className="text-indigo-500" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">MindOps // Operación Activa</span>
        </div>
      </div>

      {/* Indicador de Horizonte (Las tareas futuras) */}
      <div className="flex justify-center gap-2 mb-12 opacity-40">
        {plan.map((_: any, i: number) => (
          <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === step ? 'w-12 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)]' : 'w-4 bg-zinc-800'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative">
        {/* Decoraciones de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, rotate: -2, transition: { duration: 0.3 } }}
            className="w-full bg-zinc-950/50 backdrop-blur-3xl border border-white/5 p-12 md:p-24 rounded-[4rem] text-center space-y-12 relative overflow-hidden shadow-2xl"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-indigo-400 font-black text-xs uppercase tracking-[0.5em] block"
              >
                Paso {step + 1} de {plan.length}
              </motion.span>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic leading-tight text-white uppercase">
                {current.tarea}
              </h1>
              {current.hora && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ejecución sugerida: {current.hora}</span>
                </div>
              )}
            </div>

            <div className="relative group max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  onClick={handleComplete}
                  disabled={isPending}
                  className="cursor-pointer relative w-full bg-white text-black py-7 rounded-[2rem] font-black text-2xl hover:bg-zinc-100 transition-all transform active:scale-95 flex items-center justify-center gap-4"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={28} />
                  ) : (
                    <>
                        <span>LIBERAR CARGA</span>
                    </>
                  )}
                </button>
            </div>
            
            {/* El Horizonte: ¿Qué viene después? */}
            <div className="pt-12 border-t border-white/5 min-h-[100px]">
                {plan[step + 1] ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="space-y-2"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Próximo objetivo</p>
                    <p className="text-lg font-bold text-zinc-300 italic">"{plan[step+1].tarea}"</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="w-8 h-8 rounded-full border border-indigo-500 flex items-center justify-center">
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-2 h-2 bg-indigo-500 rounded-full" 
                        />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Fin de la secuencia táctica</p>
                  </div>
                )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
