'use client'
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Thought {
  id: string;
  accion_inmediata: string;
  plan_de_accion: string | string[];
  contexto?: string;
  status?: string;
}

interface MissionViewProps {
  thought: Thought;
}

export function MissionView({ thought }: MissionViewProps) {
  // Parse action plan
  let actionPlan: string[] = [];
  
  if (typeof thought.plan_de_accion === 'string') {
    try {
      const parsed = JSON.parse(thought.plan_de_accion);
      actionPlan = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      actionPlan = [];
    }
  } else if (Array.isArray(thought.plan_de_accion)) {
    actionPlan = thought.plan_de_accion;
  }

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const progress = actionPlan.length > 0 
    ? (completedSteps.size / actionPlan.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wider">Volver al Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-indigo-900">Misión Activa</span>
          </div>
        </motion.div>

        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Target className="text-white" size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Objetivo Principal</p>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight italic leading-tight">
                  {thought.accion_inmediata}
                </h1>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white/60 uppercase tracking-wider">Progreso de Misión</span>
                <span className="text-sm font-black text-white">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[3rem] shadow-xl p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">Plan de Acción</h2>
          </div>

          <div className="space-y-4">
            {actionPlan.map((step: string, index: number) => {
              const isCompleted = completedSteps.has(index);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => toggleStep(index)}
                  className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="text-emerald-600" size={24} />
                      ) : (
                        <Circle className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          isCompleted ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          Paso {index + 1}
                        </span>
                      </div>
                      <p className={`text-base font-medium leading-relaxed ${
                        isCompleted ? 'text-emerald-900 line-through' : 'text-slate-700'
                      }`}>
                        {step}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {completedSteps.size === actionPlan.length && actionPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-center"
            >
              <p className="text-white font-black text-lg uppercase tracking-wider">
                🎉 ¡Misión Completada!
              </p>
              <p className="text-white/80 text-sm mt-2">
                Has completado todos los pasos. Excelente trabajo.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Context Card */}
        {thought.contexto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 rounded-[3rem] shadow-xl p-8"
          >
            <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">Contexto</h3>
            <p className="text-white/90 text-base leading-relaxed">
              {thought.contexto}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
