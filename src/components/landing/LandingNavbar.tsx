'use client';

import { BrainCircuit } from 'lucide-react';
import { LanguageSwitcher } from '@/components/dashboard/LanguageSwitcher';
import { motion } from 'framer-motion';

export function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200" aria-hidden="true">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
            MIND<span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent italic">OPS</span>
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </motion.nav>
  );
}
