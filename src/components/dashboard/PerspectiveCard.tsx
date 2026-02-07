import { Target, Shield, Zap, Star, ChevronRight, List, Eye, Heart } from 'lucide-react';

export function PerspectiveCard({ content, isProteccion }: { content: string, isProteccion: boolean }) {
  return (
    <div className={`rounded-[3.5rem] p-12 text-white shadow-2xl flex flex-col justify-between transform hover:scale-[1.01] transition-all duration-500 relative overflow-hidden ${
      isProteccion ? 'bg-gradient-to-br from-amber-500 to-rose-600' : 'bg-[#6334FF]'
    }`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="text-white/80" fill="currentColor" />
          <h3 className="text-2xl font-black uppercase tracking-tight italic text-white leading-none">Tu Mirada</h3>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">ES TU REFLEJO:</p>
            <p className="text-xs text-white/70 font-medium leading-relaxed max-w-[280px]">
              Es la interpretación del sistema sobre tus patrones. Te ayuda a ver con claridad cuando estás atrapado en el ruido.
            </p>
          </div>

          <div className="h-px w-full bg-white/10" />

          <p className="text-2xl font-black leading-[1.1] tracking-tight text-white italic opacity-90">
            &quot;{content}&quot;
          </p>
        </div>
      </div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-[100px]" />
    </div>
  );
}