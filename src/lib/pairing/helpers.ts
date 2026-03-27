/**
 * Helper functions for the pairing flow
 */

import { PAIRING_CODE, PAIRING_CODE_EXPIRATION_MINUTES, DEFAULT_USER_NAME } from './constants';
import type { PairingCodeData, UserMetadata, Profile } from './types';

/**
 * Resolves the user display name from multiple sources with fallback
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
 * Generates a new pairing code with its expiration
 */
export function generatePairingCodeData(): PairingCodeData {
  const code = Math.floor(
    PAIRING_CODE.MIN + Math.random() * (PAIRING_CODE.MAX - PAIRING_CODE.MIN + 1)
  ).toString();

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + PAIRING_CODE_EXPIRATION_MINUTES);

  return {
    code,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Checks if a pairing code has expired
 */
export function isPairingCodeExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt) < new Date();
}

/**
 * Checks if the user has already completed the pairing process
 */
export function isUserPaired(profile: Profile | null): boolean {
  return profile?.onboarding_state === 'READY' || Boolean(profile?.telegram_id && profile?.phone_number);
}

/**
 * Checks if the user is waiting to share their Telegram contact
 * (they successfully sent the code but haven't shared their phone number yet)
 */
export function isUserPendingContact(profile: Profile | null): boolean {
  return profile?.onboarding_state === 'PENDING_CONTACT';
}
