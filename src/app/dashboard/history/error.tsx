'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function HistoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('History error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-[var(--color-surface,#FDFDFF)] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <AlertTriangle size={40} className="text-amber-400 mx-auto" aria-hidden="true" />
        <h2 className="text-2xl font-black italic tracking-tight text-slate-900">
          Something went wrong
        </h2>
        <p className="text-sm font-medium text-slate-400">
          We couldn&apos;t load your thought history. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="cursor-pointer flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
