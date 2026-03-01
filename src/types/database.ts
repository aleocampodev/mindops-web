import type { MissionStatusValue } from '@/lib/constants/mission-status';

export type FrictionLevel = '🔴 ALTA (Bloqueo)' | '🟡 MEDIA (Vago)' | '🟢 BAJA (Claro)';
export type SystemMode = 'PROTECCION' | 'EJECUCION';

export interface Thought {
  id: string;
  telegram_id: number;
  content: string;
  titulo_resumen: string;
  accion_inmediata: string;
  friccion: FrictionLevel;
  modo_sistema: SystemMode;
  analisis_estrategico: string;
  created_at: string;
  status: MissionStatusValue;
}