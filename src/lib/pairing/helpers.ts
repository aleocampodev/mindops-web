/**
 * Funciones helper para el flujo de pairing
 */

import { PAIRING_CODE, PAIRING_CODE_EXPIRATION_MINUTES, DEFAULT_USER_NAME } from './constants';
import type { PairingCodeData, UserMetadata, Profile } from './types';

/**
 * Resuelve el nombre de usuario desde múltiples fuentes con fallback
 */
export function getUserDisplayName(
  profile: Profile | null,
  userMetadata: UserMetadata | undefined,
  email: string | undefined
): string {
  return (
    profile?.first_name ||
    userMetadata?.full_name?.split(' ')[0] ||
    userMetadata?.name?.split(' ')[0] ||
    email?.split('@')[0] ||
    DEFAULT_USER_NAME
  );
}

/**
 * Genera un nuevo código de pairing con su expiración
 */
export function generatePairingCodeData(): PairingCodeData {
  const code = Math.floor(
    PAIRING_CODE.MIN + Math.random() * PAIRING_CODE.MAX
  ).toString();

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + PAIRING_CODE_EXPIRATION_MINUTES);

  return {
    code,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Verifica si un código de pairing ha expirado
 */
export function isPairingCodeExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt) < new Date();
}

/**
 * Verifica si el usuario ya completó el pairing
 */
export function isUserPaired(profile: Profile | null): boolean {
  return Boolean(profile?.telegram_id && profile?.phone_number);
}

/**
 * Verifica si el usuario está esperando compartir su contacto de Telegram
 * (ya envió el código exitosamente pero aún no ha compartido su número)
 */
export function isUserPendingContact(profile: Profile | null): boolean {
  return Boolean(profile?.telegram_id && !profile?.phone_number);
}
