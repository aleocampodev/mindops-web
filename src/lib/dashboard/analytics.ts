/**
 * Utilidades de análisis para el Dashboard de MindOps
 */

export interface Thought {
  id: string;
  created_at: string;
  friccion: string;
  modo_sistema: string;
}

export interface ResilienceMetric {
  delta: number;
  label: 'OPTIMAL' | 'STABLE' | 'VULNERABLE' | 'PENDING';
  trend: 'increase' | 'decrease' | 'neutral';
  description: string;
}

/**
 * Convierte un emoji de fricción en un valor numérico (0-100)
 */
export function friccionToValue(friccion: string | null): number {
  if (!friccion) return 20; // Default a fluido
  if (friccion.includes('🔴')) return 95;
  if (friccion.includes('🟡')) return 50;
  if (friccion.includes('🟢')) return 20;
  return 20;
}

/**
 * Calcula la métrica de resiliencia comparando la semana actual vs la anterior
 */
export function calculateResilienceMetric(thoughts: Thought[]): ResilienceMetric {
  if (!thoughts || thoughts.length === 0) {
    return {
      delta: 0,
      label: 'PENDING',
      trend: 'neutral',
      description: 'Inicia tu primer desahogo para activar el monitoreo.'
    };
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // 1. Agrupar pensamientos por semana
  const currentWeekThoughts = thoughts.filter(t => new Date(t.created_at) >= oneWeekAgo);
  const previousWeekThoughts = thoughts.filter(t => {
    const date = new Date(t.created_at);
    return date >= twoWeeksAgo && date < oneWeekAgo;
  });

  // Si no hay datos previos para comparar, retornamos un estado base optimista
  if (previousWeekThoughts.length === 0) {
    return {
      delta: 0,
      label: 'STABLE',
      trend: 'neutral',
      description: 'Tu capacidad de reset biológico está en fase de calibración.'
    };
  }

  // 2. Calcular promedios de fricción
  // Nota: Menor fricción = mayor resiliencia
  const avgFriccionCurrent = currentWeekThoughts.length > 0
    ? currentWeekThoughts.reduce((acc, t) => acc + friccionToValue(t.friccion), 0) / currentWeekThoughts.length
    : 20; // Si no hay datos esta semana, asumimos calma para el cálculo

  const avgFriccionPrev = previousWeekThoughts.reduce((acc, t) => acc + friccionToValue(t.friccion), 0) / previousWeekThoughts.length;

  // 3. Calcular Delta de Resiliencia
  // Si la fricción baja, la resiliencia sube.
  // Ejemplo: Antes 80, ahora 40. Mejora = ((80 - 40) / 80) * 100 = +50%
  const delta = Math.round(((avgFriccionPrev - avgFriccionCurrent) / avgFriccionPrev) * 100);

  // 4. Determinar Label y Descripción (UX Writing)
  let label: ResilienceMetric['label'] = 'STABLE';
  let description = 'Tu ritmo de procesamiento se mantiene constante.';
  const trend: ResilienceMetric['trend'] = delta > 0 ? 'increase' : delta < 0 ? 'decrease' : 'neutral';

  if (delta >= 10) {
    label = 'OPTIMAL';
    description = `Has mejorado tu reset biológico un ${delta}% este mes.`;
  } else if (delta <= -10) {
    label = 'VULNERABLE';
    description = 'Detectamos un aumento en la inercia mental. Considera una pausa activa.';
  } else if (avgFriccionCurrent <= 30) {
    label = 'OPTIMAL';
    description = 'Mantienes una carga cognitiva baja y fluida.';
  }

  return { delta, label, trend, description };
}
