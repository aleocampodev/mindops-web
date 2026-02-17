'use client'
import { useTransition } from 'react';
import { Zap, Loader2, Sparkles, ChevronRight, Star } from 'lucide-react';
import { completeThought } from '@/app/dashboard/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@tremor/react';

interface Thought {
  id: string;
  friccion: string | null;
  accion_inmediata: string;
  titulo_resumen: string;
  status: string;
}

interface MomentumProps {
  thoughts: Thought[];
  isProteccion: boolean;
}

export function MomentumAnchor({ thoughts, isProteccion }: MomentumProps) {
  const [isPending, startTransition] = useTransition();

  // 1. Filtramos solo lo pendiente
  const pendingActions = thoughts.filter(t => t.status === 'pendiente');
  
  if (isProteccion) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-4 p-8 md:p-12 rounded-[3.5rem] bg-amber-50 border-2 border-dashed border-amber-200 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-amber-500 rounded-[1.8rem] flex items-center justify-center mx-auto shadow-xl shadow-amber-200 animate-pulse">
          <Zap className="text-white" fill="white" size={28} />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-amber-900 uppercase tracking-tighter italic">
            Active Pause Protocol
          </h3>
          <p className="text-amber-800/70 max-w-lg mx-auto text-sm font-medium leading-relaxed">
            Your system detected a critical load. <span className="font-bold text-amber-900">There are no pending tasks today.</span> Your only mission is the biological reset on Telegram.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="lg:col-span-4 space-y-8">
      {/* BANNER TWILIO */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-[2rem] flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <span>Active Surveillance: Twilio monitors your inertia. If you get blocked, Twilio will call you.</span>
      </div>

      <header className="max-w-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
            <Zap size={18} fill="currentColor" />
          </div>
          <h3 className="text-xl font-black tracking-tighter uppercase text-slate-800 italic">
            Your Momentum Anchor
          </h3>
        </div>
        <p className="text-slate-400 text-[11px] font-medium leading-relaxed uppercase tracking-widest opacity-70">
          Focus on the first action. The rest waits in line.
        </p>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2 -mx-2">
        <AnimatePresence mode="popLayout">
          {pendingActions.length > 0 ? (
            pendingActions.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative flex-shrink-0 transition-all duration-500 ${
                  index === 0 
                    ? 'w-[350px] md:w-[600px] p-8 md:p-12 rounded-[4rem] bg-white border border-slate-100 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.1)]' 
                    : 'w-[280px] p-6 rounded-[3rem] bg-slate-50/50 border border-dashed border-slate-200 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={`${index === 0 ? 'w-20 h-20 text-4xl' : 'w-12 h-12 text-2xl'} rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100`}>
                      {task.friccion ? task.friccion.split(' ')[0] : '📍'}
                    </div>
                    {index === 0 && (
                      <Badge color="indigo" size="xs" className="uppercase font-black px-4 py-1 rounded-full tracking-widest">
                        Priority
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h2 className={`${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'} font-black text-slate-900 tracking-tight leading-tight`}>
                      {task.accion_inmediata}
                    </h2>
                    <p className={`${index === 0 ? 'text-sm' : 'text-xs'} text-slate-400 font-medium italic italic opacity-80`}>
                      &quot;{task.titulo_resumen}&quot;
                    </p>
                  </div>

                  {index === 0 && (
                    <button 
                      type="button"
                      className={`w-full mt-4 cursor-pointer group/btn relative overflow-hidden py-5 rounded-2xl font-black text-[10px] transition-all uppercase tracking-[0.3em] active:scale-95 flex items-center justify-center gap-3 ${
                        isPending ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-indigo-600'
                      }`}
                      onClick={() => {
                        startTransition(async () => {
                          await completeThought(task.id);
                        });
                      }}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="animate-spin" size={16} /> : 'Release Thread'}
                      {!isPending && <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
                    </button>
                  )}
                </div>
                {index === 0 && (
                  <Zap className="absolute -bottom-10 -right-10 text-slate-50 size-48 -rotate-12 opacity-50 -z-0" fill="currentColor" />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-20 text-center bg-gradient-to-b from-white to-indigo-50/30 rounded-[3.5rem] border-2 border-dashed border-indigo-100 shadow-inner"
            >
              <div className="relative inline-block mb-6">
                <Sparkles className="text-amber-400 animate-pulse" size={56} />
                <motion.div 
                   animate={{ rotate: 360 }} 
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute -top-4 -right-4"
                >
                   <Star className="text-indigo-200 fill-indigo-100" size={24} />
                </motion.div>
              </div>
              <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic mb-2">Congratulations, Free Mind!</h4>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] max-w-xs mx-auto leading-relaxed">
                You have processed all the noise. Your biological RAM is ready to create, not to manage.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}