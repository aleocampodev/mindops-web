/**
 * Tipos TypeScript para el flujo de pairing
 */

export interface Profile {
  id: string;
  telegram_id?: string | null;
  phone_number?: string | null;
  pairing_code?: string | null;
  pairing_code_expires_at?: string | null;
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
