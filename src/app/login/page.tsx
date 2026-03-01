'use client'
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';

// Google logo as inline SVG — avoids external img dependency (CORS, CLS, CSP)
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

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
    <main className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative">

      {/* Ambient light orbs — decorative, aria-hidden */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 -left-20 w-96 h-96 bg-indigo-300 blur-[100px] rounded-full pointer-events-none"
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-fuchsia-200 blur-[120px] rounded-full pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        {/* Glassmorphism card */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 rounded-[3.5rem] text-center relative overflow-hidden">

          {/* Logo */}
          <div className="relative w-20 h-20 mx-auto mb-10" aria-hidden="true">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-500 w-full h-full rounded-[2rem] flex items-center justify-center shadow-xl">
              <BrainCircuit className="text-white" size={40} />
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 uppercase italic">
            MindOps
          </h1>
          <p className="text-slate-500 mb-12 font-medium leading-relaxed">
            Synchronize your account to manage your{' '}
            <span className="text-indigo-600 font-bold">Cognitive Load.</span>
          </p>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              aria-label="Sign in with Google"
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center gap-4 text-lg group relative overflow-hidden shadow-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <GoogleLogo />
              LOGIN WITH GOOGLE
            </button>

            <div className="flex items-center justify-center gap-4 pt-6 opacity-60">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-900 font-black tracking-[0.2em] uppercase">
                <ShieldCheck size={14} className="text-emerald-500" aria-hidden="true" /> Secure
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-900 font-black tracking-[0.2em] uppercase">
                <Sparkles size={14} className="text-indigo-500" aria-hidden="true" /> AI Powered
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-10 text-[11px] font-bold tracking-[0.3em] uppercase">
          Executive Support for Dynamic Minds
        </p>
      </motion.div>
    </main>
  );
}