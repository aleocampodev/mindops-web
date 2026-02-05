'use client'
import { Card, AreaChart } from '@tremor/react';
import { Info } from 'lucide-react';

export function RhythmChart({ data, isProteccion }: { data: any[], isProteccion: boolean }) {
  return (
    <Card className="lg:col-span-3 rounded-[3rem] border-none shadow-2xl bg-white/80 p-10 relative overflow-hidden group">
      <div className="mb-10 max-w-xl">
         <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Info size={16} />
            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Tu Ritmo de Calma</h3>
         </div>
         <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Este gráfico traduce tus desahogos en niveles de ruido mental. 
            <span className="text-slate-900 font-bold ml-1">Úsalo para entender en qué momentos del día tu mente necesita un respiro.</span>
         </p>
      </div>
      
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="hora"
        categories={["Carga Mental"]}
        colors={isProteccion ? ["amber"] : ["indigo"]}
        showYAxis={false}
        showLegend={false}
        curveType="monotone"
        showGridLines={false}
        startEndOnly={true}
      />
    </Card>
  );
}