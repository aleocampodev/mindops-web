import { Heart } from 'lucide-react';

export function PerspectiveCard({ content, isProteccion }: { content: string, isProteccion: boolean }) {
  return (
    <div className={`rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden ${
      isProteccion ? 'bg-gradient-to-br from-amber-500 to-rose-600' : 'bg-gradient-to-br from-indigo-600 to-violet-700'
    }`}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Heart size={24} className="text-white/40" fill="currentColor" />
          <h3 className="text-xl font-black uppercase tracking-tighter italic text-white">Tu Mirada</h3>
        </div>
        <p className="text-[10px] text-white/60 mb-4 font-bold uppercase tracking-widest leading-tight">
          ES TU REFLEJO: <br/> 
          <span className="text-white font-medium normal-case tracking-normal opacity-100">
            Es la interpretación del sistema sobre tus patrones. Te ayuda a ver con claridad cuando estás atrapado en el ruido.
          </span>
        </p>
        <p className="text-lg font-medium leading-relaxed italic border-t border-white/10 pt-6">
          "{content}"
        </p>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}