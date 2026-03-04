'use client'
import { useEffect } from 'react';
import Link from 'next/link';

export default function MissionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Mission Error]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 rounded-[1.5rem] flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
          Mission Unavailable
        </h1>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">
          Could not load this mission. Please try again or return to the dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors duration-200 text-sm uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="text-slate-400 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-colors duration-200"
          >
            Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}
