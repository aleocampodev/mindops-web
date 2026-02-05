'use client'
import { Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from '@tremor/react';

interface ActionListProps {
  thoughts: any[];
  isProteccion: boolean;
}

export function ActionList({ thoughts, isProteccion }: ActionListProps) {
  // Filtramos solo lo que está pendiente
  const pendingActions = thoughts.filter(t => t.status === 'pendiente');

  return (
    <div className="lg:col-span-4 space-y-8">
      {/* EXPLICACIÓN DE LA SECCIÓN */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Zap className="text-indigo-600" fill="currentColor" size={24} />
          </div>
          <h3 className="text-3xl font-black tracking-tighter uppercase text-slate-800 italic">
            Un camino a la vez
          </h3>
        </div>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          Tu sistema rinde mejor cuando solo tiene un foco de atención. Estas son tus 
          <span className="text-indigo-600 font-bold mx-1">Acciones Atómicas</span>: 
          pasos físicos de menos de 5 minutos diseñados para romper la inercia sin sobrecargar tu procesador mental.
        </p>
      </div>

      {/* CONTENEDOR DE LA LISTA */}
      <div className="grid grid-cols-1 gap-6">
        {pendingActions.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
            <CheckCircle2 className="mx-auto mb-4 text-emerald-500 opacity-20" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
              Mente despejada. Sistema operativo en equilibrio.
            </p>
          </div>
        ) : (
          pendingActions.map((t) => (
            <div 
              key={t.id} 
              className="flex flex-col md:flex-row justify-between items-center p-8 rounded-[3.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 group"
            >
              <div className="flex items-center gap-8 mb-6 md:mb-0 text-left w-full">
                {/* Indicador de Fricción Visual */}
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-slate-50 transition-transform group-hover:scale-110 duration-500 bg-slate-50`}>
                  {t.friccion.split(' ')[0]}
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                    {t.accion_inmediata}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge 
                      color={t.friccion.includes('🔴') ? "orange" : "indigo"} 
                      size="xs" 
                      className="uppercase font-black px-4 py-1 rounded-full tracking-widest"
                    >
                      {t.titulo_resumen}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Sincronizado {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* BOTÓN DE ACCIÓN: CURSOR POINTER OBLIGATORIO */}
                <button 
                  className="cursor-pointer group/btn relative overflow-hidden bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs hover:bg-indigo-600 transition-all uppercase tracking-[0.2em] shadow-lg active:scale-95"
                  onClick={() => console.log('Marcar como completado:', t.id)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Hecho
                  </span>
                  {/* Efecto de escaneo neón en el botón */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-scan" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER DE LA SECCIÓN */}
      <div className="pt-8 flex justify-center opacity-20">
         <div className="w-24 h-1 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}