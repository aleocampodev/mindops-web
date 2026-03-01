'use client'
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 py-32 px-6 text-center text-white rounded-t-[5rem]">
      <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-[0.8]">
        Exit the loop. <br /> <span className="text-indigo-400 italic">Execute again.</span>
      </h3>
      <Link
        href="/login"
        className="inline-block cursor-pointer bg-white text-slate-900 px-14 py-6 rounded-full font-black text-2xl hover:bg-indigo-400 hover:text-white transition-colors duration-200 shadow-2xl focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
      >
        SYNCHRONIZE MY MIND
      </Link>
      <p className="mt-20 text-[11px] font-mono opacity-30 tracking-[1em] uppercase text-center">
        MindOps // Performance Engineering
      </p>
    </footer>
  );
}