export type Friccion = '🔴 ALTA (Bloqueo)' | '🟡 MEDIA (Vago)' | '🟢 BAJA (Claro)';
export type ModoSistema = 'PROTECCION' | 'EJECUCION';

export interface Thought {
  id: string;
  telegram_id: number;
  content: string;
  titulo_resumen: string;
  accion_inmediata: string;
  friccion: Friccion;
  modo_sistema: ModoSistema;
  analisis_estrategico: string;
  created_at: string;
  status: 'pendiente' | 'completado';
}