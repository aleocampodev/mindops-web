/**
 * Analysis utilities for the MindOps Dashboard
 */

export interface Thought {
  id: string;
  created_at: string;
  friction_score: number;    // 0-100 numeric score
  system_mode?: string;
}

export interface ResilienceMetric {
  delta: number;
  label: 'OPTIMAL' | 'STABLE' | 'VULNERABLE' | 'PENDING';
  trend: 'increase' | 'decrease' | 'neutral';
  description: string;
}

/**
 * Returns friction_score as a numeric value (0-100)
 */
export function friccionToValue(t: Thought): number {
  return typeof t.friction_score === 'number' ? t.friction_score : 20;
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
      description: 'Start your first session so we can begin learning your rhythm.'
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
      description: 'We are learning from your rhythms to give you better insights.'
    };
  }

  // 2. Calculate friction averages
  // Note: Lower friction = higher resilience
  const avgFriccionCurrent = currentWeekThoughts.length > 0
    ? currentWeekThoughts.reduce((acc, t) => acc + friccionToValue(t), 0) / currentWeekThoughts.length
    : 20;

  const avgFriccionPrev = previousWeekThoughts.reduce((acc, t) => acc + friccionToValue(t), 0) / previousWeekThoughts.length;

  // 3. Calculate Resilience Delta
  // If friction goes down, resilience goes up.
  // Ejemplo: Antes 80, ahora 40. Mejora = ((80 - 40) / 80) * 100 = +50%
  const delta = Math.round(((avgFriccionPrev - avgFriccionCurrent) / avgFriccionPrev) * 100);

  // 4. Determinar Label y Descripción (UX Writing)
  let label: ResilienceMetric['label'] = 'STABLE';
  let description = 'Your calm level remains stable.';
  const trend: ResilienceMetric['trend'] = delta > 0 ? 'increase' : delta < 0 ? 'decrease' : 'neutral';

  if (delta >= 10) {
    label = 'OPTIMAL';
    description = `Your recovery capacity has improved by ${delta}% this month.`;
  } else if (delta <= -10) {
    label = 'VULNERABLE';
    description = 'We noticed you may be accumulating fatigue. Consider an active pause.';
  } else if (avgFriccionCurrent <= 30) {
    label = 'OPTIMAL';
    description = 'You maintain a low, fluid cognitive load.';
  }

  return { delta, label, trend, description };
}
