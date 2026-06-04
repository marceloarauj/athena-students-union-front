/**
 * Returns true when the institution is the reserved mock institution.
 * All service factories use this to choose between mock and real implementations.
 */
export function isMock(institution: string | undefined): boolean {
  return institution === 'mock';
}
