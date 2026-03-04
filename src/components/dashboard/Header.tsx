import { BrainCircuit } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  firstName: string;
  isProteccion: boolean;
}

export function DashboardHeader({ firstName, isProteccion }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4">
      {/* Logo — matches landing page treatment */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl shadow-sm ${isProteccion ? 'bg-amber-500' : 'bg-indigo-600'}`}>
          <BrainCircuit className="text-white" size={18} />
        </div>
        <span className="text-xl font-black tracking-tight">
          <span className="text-slate-900">MIND</span>
          <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 bg-clip-text text-transparent">OPS</span>
        </span>
      </div>

      {/* Right: greeting + avatar */}
      <div className="flex items-center gap-4">
        <p className="hidden md:block text-sm font-bold text-slate-400">
          Hello, <span className="text-slate-900">{firstName}</span>
        </p>
        <UserMenu firstName={firstName} />
      </div>
    </header>
  );
}