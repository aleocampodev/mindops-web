/**
 * MissionStatus — single source of truth for the mindops.mission_status enum.
 * These values must match the PostgreSQL enum exactly.
 */
export const MissionStatus = {
  IDLE: 'IDLE',        // Created, not yet started
  ACTIVE: 'ACTIVE',    // Actively being worked on
  PROPOSED: 'PROPOSED', // In the queue / momentum anchor
  STALLED: 'STALLED',   // Blocked — may trigger Twilio alert
  COMPLETED: 'COMPLETED', // Completed / released
} as const;

export type MissionStatusValue = typeof MissionStatus[keyof typeof MissionStatus];
