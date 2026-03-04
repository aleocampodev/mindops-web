'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Zap, ShieldAlert, PhoneIncoming, MousePointerClick } from 'lucide-react';

export function CognitiveSimulator() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const mode = searchParams.get('mode') || 'execution';
  const isCrisis = mode === 'protection';

  const toggleMode = () => {
    const params = new URLSearchParams(searchParams);
    if (isCrisis) params.delete('mode');
    else params.set('mode', 'protection');
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={`transition-all duration-1000 py-32 px-6 ${isCrisis ? 'bg-[#FFF9F2]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        <div className="space-y-12">
          <div className="space-y-6 text-left">
            <h3 className="text-5xl font-black tracking-tighter leading-none text-slate-900 uppercase italic">
              Cognitive Load <br/> <span className="text-indigo-600">Management.</span>
            </h3>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Your mind is a high-impact processor. When background processes (anxiety/sadness) consume your mind, execution stops.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { icon: <Gauge key="gauge" />, t: "Friction Monitoring", d: "We quantify the weight of your thoughts to predict blockages." },
              { icon: <Zap key="zap" />, t: "Memory Dump", d: "Externalize mental noise and safely free up processing threads." }
            ].map((f, i) => (
              <div key={i} className={`flex items-start gap-6 p-8 rounded-[2.5rem] border transition-all duration-700 ${
                isCrisis ? 'bg-amber-100/30 border-amber-200' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`p-4 rounded-2xl ${isCrisis ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'}`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1 uppercase tracking-tight text-slate-900">{f.t}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOCKUP INTERACTIVO */}
        <div className="relative">
          <button 
            onClick={toggleMode}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 cursor-pointer bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-2xl border border-white/20 uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            <MousePointerClick size={16} />
            {isCrisis ? "Reset System" : "Simulate Overload"}
          </button>

          <div className={`relative p-12 rounded-[5rem] border transition-all duration-1000 shadow-2xl bg-white ${
            isCrisis ? 'border-amber-200 ring-[20px] ring-amber-100/50' : 'border-slate-100'
          }`}>
             {/* Gráfico y Alerta de Twilio igual que el paso anterior pero refinado visualmente */}
             <div className="h-64 flex items-end gap-4 mb-12 px-4">
              {[30, 50, 40, 85, 55, 90].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    height: isCrisis && i > 2 ? '100%' : `${h}%`,
                    backgroundColor: isCrisis && i > 2 ? "#F59E0B" : "#F1F5F9"
                  }}
                  className="w-full rounded-2xl"
                />
              ))}
            </div>
            <AnimatePresence mode="wait">
              {isCrisis && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[3rem] bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-2xl text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert size={20} className="animate-pulse" />
                    <span className="font-black uppercase tracking-widest text-[10px]">Rescue Protocol</span>
                  </div>
                  <p className="font-bold text-sm leading-tight">Initiating Twilio call for pattern interruption.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}