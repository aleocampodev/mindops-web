'use client'
import { motion } from 'framer-motion';

const words = [
  "Rumiación", "Bloqueo", "Parálisis", "Caos Mental", "Ansiedad", 
  "Procrastinación", "Ruido", "Loop Infinito", "Duda", "Niebla"
];

// ⚠️ FIX: Quitamos el 'default' para que sea un Named Export
export function Marquee() {
  return (
    <div className="relative flex overflow-x-hidden border-y border-indigo-100 bg-indigo-50/30 py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...words, ...words].map((word, i) => (
          <span key={i} className="mx-8 text-2xl font-black uppercase tracking-tighter text-indigo-300/50">
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}