'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Rocket, CheckCircle2, Cpu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { advanceMissionStep } from './actions'
import { useRouter } from 'next/navigation'

interface Step {
  hora: string
  tarea: string
}

interface MissionManagerProps {
  missionId: string
  initialStep: number
  plan: Step[]
  title: string
}

export function MissionManager({ missionId, initialStep, plan, title }: MissionManagerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStep)
  const [isLifting, setIsLifting] = useState(false)
  const router = useRouter()
  
  const currentTask = plan[currentIndex]
  const nextTasks = plan.slice(currentIndex + 1, currentIndex + 4)
  const progress = Math.round(((currentIndex) / plan.length) * 100)

  // Cromatismo de Alivio: De Indigo (Enfoque) a Esmeralda (Liberación)
  const progressColor = progress > 80 ? 'from-emerald-500 to-teal-400' : 'from-indigo-600 to-violet-500'

  async function handleRelease() {
    if (isLifting) return
    setIsLifting(true)

    try {
      const result = await advanceMissionStep(missionId, currentIndex, plan.length)
      if (result.completed) {
        router.push('/dashboard')
      } else {
        setCurrentIndex(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error liberando carga:', error)
    } finally {
      setIsLifting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden flex flex-col items-center justify-center p-6 relative">
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ backgroundColor: progress > 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000" 
      />

      {/* Header Info */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-center z-10">
        <Link href="/dashboard" className="group flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Abortar Misión</span>
        </Link>
        <div className="text-right">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 italic">Operación de Alivio</p>
          <h2 className="text-xl font-black italic uppercase tracking-tighter">{title}</h2>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-12 relative z-10">
        
        {/* RAM Metric */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Cpu size={14} className="text-indigo-500" /> RAM MENTAL RECUPERADA
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black italic tracking-tighter">{progress}</span>
              <span className="text-xs font-black text-slate-500">%</span>
            </div>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full bg-gradient-to-r ${progressColor} shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-1000`}
            />
          </div>
        </div>

        {/* The Tunnel View (Cards) */}
        <div className="w-full relative min-h-[420px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateY: -10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, y: -120, x: 100, rotate: 10, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="w-full bg-white text-black p-14 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center gap-8 border-t-4 border-indigo-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Sparkles className="text-indigo-600" size={32} />
              </div>
              <div className="space-y-4">
                <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-5 py-2 rounded-full uppercase tracking-[0.2em]">Foco Actual</span>
                <h1 className="text-4xl md:text-5xl font-black italic leading-[1.05] tracking-tighter text-slate-900">
                  {currentTask?.tarea}
                </h1>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <span className="h-[1px] w-8 bg-slate-200" />
                  <p className="font-black uppercase tracking-widest text-[10px]">{currentTask?.hora}</p>
                  <span className="h-[1px] w-8 bg-slate-200" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* The Horizon (Next Steps) */}
        <div className="w-full space-y-5">
          <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Próximos en el horizonte</p>
          <div className="space-y-3">
            {nextTasks.length > 0 ? nextTasks.map((task, i) => (
              <div 
                key={i} 
                className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center justify-between opacity-30 grayscale blur-[1px] hover:blur-0 transition-all duration-500"
              >
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-sm font-bold italic text-white/70">{task.tarea}</span>
                </div>
                <span className="text-[10px] font-black text-white/20 bg-white/5 px-4 py-1.5 rounded-xl uppercase">{task.hora}</span>
              </div>
            )) : (
                <div className="p-8 border border-dashed border-white/5 rounded-3xl text-center">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">Fin de la secuencia de pasos</p>
                </div>
            )}
          </div>
        </div>

        {/* The Actuator Button */}
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgb(79, 70, 229)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRelease}
          disabled={isLifting}
          className="relative group w-full py-7 bg-indigo-700 rounded-[3rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] disabled:opacity-50 transition-colors"
        >
          {/* Neon Scan Effect */}
          <div className="absolute inset-0 w-[30%] h-full bg-white/20 skew-x-[45deg] -translate-x-[200%] group-hover:animate-scan pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-center gap-4">
            <span className="text-xl font-black italic tracking-[0.2em] uppercase">
              {isLifting ? 'Sincronizando...' : 'LIBERAR CARGA'}
            </span>
            <CheckCircle2 size={24} className="group-hover:rotate-12 transition-transform" />
          </div>
        </motion.button>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-200%) skewX(45deg); }
          100% { transform: translateX(500%) skewX(45deg); }
        }
        .animate-scan {
          animation: scan 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </main>
  )
}
