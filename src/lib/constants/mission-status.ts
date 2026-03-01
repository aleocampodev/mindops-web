/**
 * MissionStatus — single source of truth for the mindops.mission_status enum.
 * These values must match the PostgreSQL enum exactly.
 */
export const MissionStatus = {
  IDLE: 'IDLE',        // Created, not yet started
  INPROGRESS: 'INPROGRESS',  // Actively being worked on
  ACTIVE: 'ACTIVE',      // In the queue / momentum anchor
  STALLED: 'STALLED',     // Blocked — may trigger Twilio alert
  COMMITTED: 'COMMITTED',   // Completed / released
} as const;

export type MissionStatusValue = typeof MissionStatus[keyof typeof MissionStatus];
