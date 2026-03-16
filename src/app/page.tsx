'use client'
import { Suspense } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Hero } from '@/components/landing/Hero';
import { Marquee } from '@/components/ui/Marquee';
import { CognitiveSimulator } from '@/components/landing/CognitiveSimulator';
import { Footer } from '@/components/landing/Footer';

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