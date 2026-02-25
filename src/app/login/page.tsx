'use client'
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    // Fondo con gradiente animado (necesitas el CSS de abajo)
    <main className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">
      
      {/* Círculos de luz dinámicos para dar color "Vivid" */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 -left-20 w-96 h-96 bg-indigo-300 blur-[100px] rounded-full" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-fuchsia-200 blur-[120px] rounded-full" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Card con efecto de Cristal (Glassmorphism) */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 rounded-[3.5rem] text-center relative overflow-hidden">
          
          <div className="relative w-20 h-20 mx-auto mb-10">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-500 w-full h-full rounded-[2rem] flex items-center justify-center shadow-xl">
              <BrainCircuit className="text-white" size={40} />
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 uppercase italic">MindOps</h1>
          <p className="text-slate-500 mb-12 font-medium leading-relaxed">
            Synchronize your account to manage your <br/> 
            <span className="text-indigo-600 font-bold">Cognitive Load.</span>
          </p>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 text-lg group relative overflow-hidden shadow-xl cursor-pointer"
            >
              {/* Efecto de brillo al pasar el mouse */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-scan" />
              
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 brightness-200" alt="G" />
              LOGIN WITH GOOGLE
            </button>

            <div className="flex items-center justify-center gap-4 pt-6 opacity-60">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-900 font-black tracking-[0.2em] uppercase">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-900 font-black tracking-[0.2em] uppercase">
                <Sparkles size={14} className="text-indigo-500" /> AI Powered
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-10 text-[10px] font-bold tracking-[0.3em] uppercase">
          Executive Support for Dynamic Minds
        </p>
      </motion.div>
    </main>
  );
}