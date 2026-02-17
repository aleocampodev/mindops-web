/**
 * Analysis utilities for the MindOps Dashboard
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
 * Converts a friction emoji into a numeric value (0-100)
 */
export function friccionToValue(friccion: string | null): number {
  if (!friccion) return 20; // Default to fluid
  if (friccion.includes('🔴')) return 95;
  if (friccion.includes('🟡')) return 50;
  if (friccion.includes('🟢')) return 20;
  return 20;
}

/**
 * Calculates the resilience metric comparing the current week vs the previous one
 */
export function calculateResilienceMetric(thoughts: Thought[]): ResilienceMetric {
  if (!thoughts || thoughts.length === 0) {
    return {
      delta: 0,
      label: 'PENDING',
      trend: 'neutral',
      description: 'Inicia tu primer desahogo para que pueda empezar a conocer tu ritmo.'
    };
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // 1. Group thoughts by week
  const currentWeekThoughts = thoughts.filter(t => new Date(t.created_at) >= oneWeekAgo);
  const previousWeekThoughts = thoughts.filter(t => {
    const date = new Date(t.created_at);
    return date >= twoWeeksAgo && date < oneWeekAgo;
  });

  // If there is no previous data to compare, return an optimistic base state
  if (previousWeekThoughts.length === 0) {
    return {
      delta: 0,
      label: 'STABLE',
      trend: 'neutral',
      description: 'Estamos aprendiendo de tus ritmos para darte mejores datos.'
    };
  }

  // 2. Calculate friction averages
  // Note: Lower friction = higher resilience
  const avgFriccionCurrent = currentWeekThoughts.length > 0
    ? currentWeekThoughts.reduce((acc, t) => acc + friccionToValue(t.friccion), 0) / currentWeekThoughts.length
    : 20; // If no data this week, assume calm for calculation

  const avgFriccionPrev = previousWeekThoughts.reduce((acc, t) => acc + friccionToValue(t.friccion), 0) / previousWeekThoughts.length;

  // 3. Calculate Resilience Delta
  // If friction goes down, resilience goes up.
  // Ejemplo: Antes 80, ahora 40. Mejora = ((80 - 40) / 80) * 100 = +50%
  const delta = Math.round(((avgFriccionPrev - avgFriccionCurrent) / avgFriccionPrev) * 100);

  // 4. Determinar Label y Descripción (UX Writing)
  let label: ResilienceMetric['label'] = 'STABLE';
  let description = 'Tu nivel de calma se mantiene estable.';
  const trend: ResilienceMetric['trend'] = delta > 0 ? 'increase' : delta < 0 ? 'decrease' : 'neutral';

  if (delta >= 10) {
    label = 'OPTIMAL';
    description = `Has mejorado tu capacidad de recuperación un ${delta}% este mes.`;
  } else if (delta <= -10) {
    label = 'VULNERABLE';
    description = 'Notamos que podrías estar acumulando cansancio. Considera una pausa activa.';
  } else if (avgFriccionCurrent <= 30) {
    label = 'OPTIMAL';
    description = 'Mantienes una carga cognitiva baja y fluida.';
  }

  return { delta, label, trend, description };
}
