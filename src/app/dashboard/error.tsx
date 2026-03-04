'use client'
import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 rounded-[1.5rem] flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
          System Error
        </h1>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">
          Something went wrong loading the dashboard. Your data is safe.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors duration-200 text-sm uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
