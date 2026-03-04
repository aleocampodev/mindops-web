'use client'
import { useEffect } from 'react';

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Login Error]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
          Login Unavailable
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Something went wrong. Please refresh the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-600 transition-colors duration-200 text-sm uppercase tracking-widest cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
