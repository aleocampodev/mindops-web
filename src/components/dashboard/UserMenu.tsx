'use client'
import { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { logout } from '@/app/auth/logout/actions';

export function UserMenu({ firstName }: { firstName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = firstName.charAt(0).toUpperCase();

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm flex items-center justify-center shadow-lg hover:shadow-indigo-200 transition-all duration-200 cursor-pointer"
        aria-label="User menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
            <p className="text-sm font-black text-slate-900 truncate">{firstName}</p>
          </div>
          <form action={async (formData: FormData) => { await logout(); }}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
