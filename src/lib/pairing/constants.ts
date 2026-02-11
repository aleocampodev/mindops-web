/**
 * Constantes para el flujo de pairing
 */

// Rango de códigos de pairing (6 dígitos)
export const PAIRING_CODE = {
  MIN: 100_000,
  MAX: 900_000,
} as const;

// Duración de expiración del código de pairing
export const PAIRING_CODE_EXPIRATION_MINUTES = 10;

// Mensajes por defecto
export const DEFAULT_USER_NAME = 'Usuario';
