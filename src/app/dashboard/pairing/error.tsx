'use client'

import { useEffect } from 'react'
import { BrainCircuit, AlertTriangle, RefreshCw } from 'lucide-react'

export default function PairingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Pairing error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="max-w-md text-center space-y-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-indigo-600">
            <BrainCircuit className="text-white" size={18} />
          </div>
          <span className="text-lg font-black tracking-tight">
            <span className="text-white">MIND</span>
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">OPS</span>
          </span>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.06] rounded-3xl p-10 space-y-6">
          <AlertTriangle size={40} className="text-amber-400 mx-auto" />
          <h2 className="text-2xl font-black italic tracking-tight">Connection issue</h2>
          <p className="text-white/40 text-sm font-medium leading-relaxed">
            Something went wrong while setting up your pairing. Please try again.
          </p>
          <button
            onClick={reset}
            className="cursor-pointer flex items-center gap-3 mx-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </div>
    </main>
  )
}
