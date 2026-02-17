'use client'
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative max-w-6xl mx-auto pt-8 pb-24 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2 rounded-full text-[10px] font-black mb-12 border border-indigo-100 tracking-[0.3em] uppercase"
      >
        <Zap size={12} fill="currentColor" /> Mental Performance Engineering
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 text-slate-900 uppercase italic"
      >
        MIND<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-amber-400 animate-gradient-x">OPS</span>
      </motion.h1>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-8 tracking-tight leading-tight">
          Designed for <span className="text-indigo-600">dynamic minds</span> <br/> 
          needing to reclaim their execution power.
        </h2>
        <p className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
          MindOps is the <span className="text-slate-900 font-bold">operational layer</span> that detects when rumination, anxiety, or sadness overload your system, intervening to bring you back to the present.
        </p>

        <button
          onClick={() => router.push('/login')}
          className="cursor-pointer bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all flex items-center gap-4 mx-auto"
        >
          ACTIVATE PROTOCOL <ArrowRight size={22} />
        </button>
      </motion.div>
    </section>
  );
}