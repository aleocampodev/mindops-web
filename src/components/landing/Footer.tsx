'use client'
import { useRouter } from 'next/navigation';

export function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-slate-900 py-32 px-6 text-center text-white rounded-t-[5rem]">
      <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-[0.8]">
        Exit the loop. <br/> <span className="text-indigo-400 font-italic italic">Execute again.</span>
      </h3>
      <button 
        onClick={() => router.push('/login')}
        className="cursor-pointer bg-white text-slate-900 px-14 py-6 rounded-full font-black text-2xl hover:bg-indigo-400 transition-all shadow-2xl"
      >
        SYNCHRONIZE MY MIND
      </button>
      <p className="mt-20 text-[10px] font-mono opacity-30 tracking-[1em] uppercase text-center">
        MindOps // Performance Engineering
      </p>
    </footer>
  );
}