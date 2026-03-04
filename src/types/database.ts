import type { MissionStatusValue } from '@/lib/constants/mission-status';

export type SystemMode = 'PROTECTION' | 'EXECUTION';

export interface ActionPlanStep {
  task: string;
  hora?: string;
}

export interface Thought {
  id: string;
  user_id: string;
  raw_content: string;
  summary_title: string;
  friction_score: number;       // 0-100 numeric score
  friction_tag: string;         // e.g. "High Anxiety & Rumination"
  system_mode: SystemMode;
  strategic_insight: string;
  action_plan: ActionPlanStep[];
  voice_script: string;
  current_step_index: number;
  created_at: string;
  status: MissionStatusValue;
  embedding?: string;
}