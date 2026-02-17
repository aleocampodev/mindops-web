import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Target, Clock, CheckCircle2, ChevronRight, Rocket } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default async function MissionsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile?.telegram_id) redirect('/dashboard/pairing');

  const { data: thoughts } = await supabase
    .from('thoughts')
    .select('*')
    .eq('telegram_id', profile.telegram_id)
    .order('created_at', { ascending: false });

  // Filtramos todas las misiones que tienen plan de acción
  const allMissions = thoughts?.filter((t: any) => {
    let plan = t.plan_de_accion;
    if (typeof plan === 'string') {
      try { plan = JSON.parse(plan); } catch (e) { plan = null; }
    }
    return plan && Array.isArray(plan) && plan.length > 0;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activado':
        return { label: 'Active', color: 'bg-emerald-500', icon: Clock };
      case 'completado':
        return { label: 'Completed', color: 'bg-slate-400', icon: CheckCircle2 };
      default:
        return { label: 'New', color: 'bg-indigo-500', icon: Target };
    }
  };

  const latestThought = thoughts?.[0];
  const isProteccion = latestThought?.modo_sistema === 'PROTECCION';

  return (
    <main className={`min-h-screen transition-all duration-1000 ${
      isProteccion ? 'bg-[#FFF8F0]' : 'bg-[#FDFDFF]'
    }`}>
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-10">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase italic mb-3">
            All Your Missions
          </h1>
          <p className="text-slate-500 font-medium">
            {allMissions.length} {allMissions.length === 1 ? 'mission' : 'missions'} in total
          </p>
        </div>

        {/* Lista de misiones */}
        {allMissions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-12 text-center">
            <Target size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">
              You don't have any missions yet. <br/>
              Send a message to the bot to generate your first mission.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allMissions.map((mission: any, index: number) => {
              const badge = getStatusBadge(mission.status);
              const Icon = badge.icon;
              
              return (
                <Link key={mission.id} href={`/mission/${mission.id}`}>
                  <div className="bg-white/80 backdrop-blur-md border border-slate-100 hover:border-indigo-200 rounded-[2rem] p-6 transition-all hover:shadow-lg cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${badge.color}`} />
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {badge.label}
                          </span>
                          <span className="text-[9px] font-medium text-slate-300">
                            {new Date(mission.created_at).toLocaleDateString('en-US', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-black text-slate-900 mb-2 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">
                          {mission.titulo_resumen || mission.accion_inmediata}
                        </h3>
                        
                        {mission.analisis_estrategico && (
                          <p className="text-sm text-slate-500 line-clamp-2 font-medium">
                            {mission.analisis_estrategico}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-indigo-200">
                          <Rocket 
                            size={18} 
                            className="text-slate-400 group-hover:text-white group-hover:-translate-y-0.5 transition-all" 
                          />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-600 transition-colors">Execute</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
