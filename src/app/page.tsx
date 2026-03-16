'use client'
import { Suspense } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Hero } from '@/components/landing/Hero';
import { Marquee } from '@/components/ui/Marquee';
import { Footer } from '@/components/landing/Footer';
import dynamic from 'next/dynamic';

const CognitiveSimulator = dynamic(
  () => import('@/components/landing/CognitiveSimulator').then((mod) => mod.CognitiveSimulator),
  { ssr: false, loading: () => <div className="h-[400px] animate-pulse bg-slate-50 rounded-[5rem] my-32 mx-6" /> }
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFF] overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Suspense fallback={<div className="h-screen bg-white" />}>
        <LandingNavbar />
        
        <Hero />
        <Marquee />
        <CognitiveSimulator />
        <Footer />
      </Suspense>
    </main>
  );
}