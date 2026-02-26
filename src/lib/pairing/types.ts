/**
 * TypeScript types for the pairing flow
 */

export interface Profile {
  id: string;
  telegram_id?: string | null;
  phone_number?: string | null;
  pairing_code?: string | null;
  pairing_code_expires_at?: string | null;
  onboarding_state?: 'NEW' | 'PENDING_LINK' | 'READY' | null;
  first_name?: string | null;
}

export interface PairingCodeData {
  code: string;
  expiresAt: string;
}

export interface UserMetadata {
  full_name?: string;
  name?: string;
  email?: string;
}
