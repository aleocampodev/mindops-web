import { BrainCircuit, LogOut } from 'lucide-react';
import { logout } from '@/app/auth/logout/actions';

interface HeaderProps {
  firstName: string;
  isProteccion: boolean;
  energyLevel: number;
}

export function DashboardHeader({ firstName, isProteccion, energyLevel }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <div className={`p-2 rounded-xl shadow-sm ${isProteccion ? 'bg-amber-500' : 'bg-indigo-600'}`}>
             <BrainCircuit className="text-white" size={20} />
           </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">MindOps // Misión de {firstName}</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
          Hola, {firstName}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <form action={logout}>
          <button type="submit" className="cursor-pointer group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-rose-600 transition-all">
            <LogOut size={12} className="group-hover:-translate-x-1 transition-transform" />
            Desconectar
          </button>
        </form>

        <div className={`flex items-center gap-4 p-4 rounded-3xl border backdrop-blur-md ${
          isProteccion ? 'bg-amber-100/50 border-amber-200 text-amber-900' : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
        }`}>
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Status de Operación</p>
            <p className="font-black text-[13px] uppercase tracking-tighter">
              {energyLevel >= 80 ? '🚀 Flujo Máximo' : 
               energyLevel >= 50 ? '⚖️ Carga Estable' : 
               '⚠️ Agotamiento'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl transition-all ${
            isProteccion ? 'bg-amber-500 scale-105 shadow-amber-200' : 'bg-indigo-600'
          }`}>
            {energyLevel}%
          </div>
        </div>
      </div>
    </header>
  );
}