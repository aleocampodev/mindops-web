'use client'
import { useTransition } from 'react';
import { Zap, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { completeThought } from '@/app/dashboard/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@tremor/react';

interface MomentumProps {
  thoughts: any[];
  isProteccion: boolean;
}

export function MomentumAnchor({ thoughts, isProteccion }: MomentumProps) {
  const [isPending, startTransition] = useTransition();

  // 1. Filtramos solo lo pendiente
  const pendingActions = thoughts.filter(t => t.status === 'pendiente');
  
  // 2. Definimos el "Ancla": El único pensamiento en el que debes enfocarte
  const currentAnchor = pendingActions[0];
  const othersCount = pendingActions.length - 1;

  // 3. Estado de Protección: Si Ale está mal, bloqueamos la ejecución
  if (isProteccion) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-4 p-12 md:p-20 rounded-[4rem] bg-amber-50 border-2 border-dashed border-amber-200 text-center space-y-8"
      >
        <div className="w-24 h-24 bg-amber-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-200 animate-pulse">
          <Zap className="text-white" fill="white" size={40} />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-amber-900 uppercase tracking-tighter italic">
            Protocolo de Pausa Activo
          </h3>
          <p className="text-amber-800/70 max-w-xl mx-auto text-xl font-medium leading-relaxed">
            Tu sistema detectó una carga crítica. <span className="font-bold text-amber-900">Hoy no hay tareas pendientes.</span> Tu única misión es el reset biológico que tienes en Telegram. El espacio de ejecución se abrirá cuando tu energía se estabilice.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="lg:col-span-4 space-y-10">
      {/* EXPLICACIÓN PEDAGÓGICA */}
      <header className="max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Zap className="text-indigo-600" fill="currentColor" size={24} />
          </div>
          <h3 className="text-3xl font-black tracking-tighter uppercase text-slate-800 italic">
            Tu Ancla de Impulso
          </h3>
        </div>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          Tu cerebro rinde mejor con un solo objetivo. Esta es la <span className="text-indigo-600 font-bold">Acción Atómica</span> prioritaria. No mires el resto, solo libera este hilo para recuperar tu impulso.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {currentAnchor ? (
          <motion.div 
            key={currentAnchor.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden bg-white border border-slate-100 rounded-[4.5rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.12)] group"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 text-left">
              
              {/* EMOJI GIGANTE */}
              <div className="w-32 h-32 rounded-[2.8rem] bg-slate-50 flex items-center justify-center text-6xl shadow-inner border border-slate-100 transition-transform group-hover:scale-110 duration-700">
                {currentAnchor.friccion ? currentAnchor.friccion.split(' ')[0] : '📍'}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                   <Badge color="indigo" size="xs" className="uppercase font-black px-4 py-1 rounded-full tracking-[0.2em]">
                      Acción Prioritaria
                   </Badge>
                   {othersCount > 0 && (
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                        +{othersCount} hilos en espera
                     </span>
                   )}
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.95]">
                  {currentAnchor.accion_inmediata}
                </h2>
                
                <p className="text-xl text-slate-400 font-medium italic">
                  "{currentAnchor.titulo_resumen}"
                </p>
              </div>

              {/* BOTÓN DE LIBERACIÓN */}
              <button 
                type="button"
                className={`cursor-pointer group/btn relative overflow-hidden px-16 py-8 rounded-[2.5rem] font-black text-sm transition-all uppercase tracking-[0.3em] shadow-2xl active:scale-95 flex items-center justify-center min-w-[220px] ${
                  isPending ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-200'
                }`}
                onClick={() => {
                  startTransition(async () => {
                    await completeThought(currentAnchor.id);
                  });
                }}
                disabled={isPending}
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      PROCESANDO
                    </>
                  ) : (
                    <>
                      LIBERAR
                      <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                {!isPending && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-scan" />
                )}
              </button>
            </div>

            {/* Decoración de fondo abstracta */}
            <Zap className="absolute -bottom-16 -right-16 text-slate-50 size-80 -rotate-12 opacity-50 -z-0" fill="currentColor" />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center bg-white/50 rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner"
          >
            <Sparkles className="mx-auto mb-6 text-emerald-400 opacity-40" size={64} />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm">Mente Despejada // RAM Libre</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}