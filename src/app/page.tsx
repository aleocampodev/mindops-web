'use client'
import { Suspense } from 'react';
import { Hero } from '@/components/landing/Hero';
import { Marquee } from '@/components/Marquee';
import { CognitiveSimulator } from '@/components/landing/CognitiveSimulator';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFF] overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Suspense fallback={<div className="h-screen bg-white" />}>
        {/* Navbar minimalista (sin logos ni botones según tu instrucción) */}
        <nav className="h-20 w-full" /> 
        
        <Hero />
        <Marquee />
        <CognitiveSimulator />
        <Footer />
      </Suspense>
    </main>
  );
}