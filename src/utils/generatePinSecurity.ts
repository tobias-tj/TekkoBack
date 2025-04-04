/**
 * Genera un PIN de seguridad alfanumérico de longitud especificada
 * @param length Longitud del PIN (por defecto 8)
 * @returns PIN alfanumérico generado
 */
export function generatePinSecurity(length: number = 8): string {
  if (length <= 0) {
    throw new Error('La longitud del PIN debe ser mayor que 0');
  }

  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let pin = '';

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    pin += chars[randomValues[i] % chars.length];
  }

  return pin;
}
