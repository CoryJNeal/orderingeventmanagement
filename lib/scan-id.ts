/**
 * Stable, human-readable Scan ID for vendor lookup.
 * Distinct from the HR employee ID.
 *
 * The code is Crockford Base32 (0-9 and A-Z without I, L, O, or U):
 * https://www.crockford.com/base32.html
 */

const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Encode bytes as Crockford Base32, most significant bits first. */
export function encodeCrockfordBase32(bytes: Uint8Array): string {
  let buffer = 0;
  let bits = 0;
  let output = "";

  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += CROCKFORD_ALPHABET[(buffer >> bits) & 31];
    }
  }

  if (bits > 0) {
    output += CROCKFORD_ALPHABET[(buffer << (5 - bits)) & 31];
  }

  return output;
}

function fnv1a32(input: string, seed = 2166136261): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function generateScanId(
  employeeId: string,
  customerNumber: string,
  locationNumber: string
): string {
  const input = `${employeeId}:${customerNumber}:${locationNumber}`;
  const primary = fnv1a32(input);
  // A second mix supplies the fifth byte so the code is exactly 8 symbols
  // (40 bits), with no partial group pinned to a few characters.
  const extra = fnv1a32(`${input}:scan`, 2166136261 ^ primary);
  const bytes = new Uint8Array([
    (primary >>> 24) & 255,
    (primary >>> 16) & 255,
    (primary >>> 8) & 255,
    primary & 255,
    extra & 255,
  ]);
  return `SC-${encodeCrockfordBase32(bytes)}`;
}
