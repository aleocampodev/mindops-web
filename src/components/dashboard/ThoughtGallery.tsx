'use client'
import { motion } from 'framer-motion';
import { Calendar, History } from 'lucide-react';

interface Thought {
  id: string;
  friccion: string | null;
  accion_inmediata: string;
  titulo_resumen: string;
  content: string;
  status: string;
  created_at: string;
}

export function ThoughtGallery({ thoughts }: { thoughts: Thought[] }) {
  // Solo mostramos los pensamientos que ya fueron "liberados" (status: completado)
  const history = thoughts.filter(t => t.status === 'completado');

  if (history.length === 0) return null;

  return (
    <section className="lg:col-span-4 mt-12 space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-slate-100 p-2 rounded-lg text-slate-400">
          <History size={20} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">
          Caja Negra: Pensamientos Sincronizados
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-md border border-slate-100 p-6 rounded-[2.5rem] shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{t.friccion ? t.friccion.split(' ')[0] : '💭'}</span>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={10} /> {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h4 className="font-black text-slate-900 text-lg leading-tight mb-2 uppercase tracking-tight">
                {t.titulo_resumen}
              </h4>
              
              {/* El "Caos original" en una caja colapsable o discreta */}
              <p className="text-slate-500 text-sm italic line-clamp-3 mb-4 transition-all group-hover:line-clamp-none">
                "{t.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Impacto de la Acción:</p>
              <p className="text-xs font-bold text-slate-700">{t.accion_inmediata}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
