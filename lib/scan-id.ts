/**
 * Stable, human-readable Scan ID for vendor lookup.
 * Distinct from the HR employee ID.
 */
export function generateScanId(
  employeeId: string,
  customerNumber: string,
  locationNumber: string
): string {
  const input = `${employeeId}:${customerNumber}:${locationNumber}`;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const code = (hash >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return `SC-${code}`;
}
