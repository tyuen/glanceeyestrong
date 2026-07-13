export type InitResponseCandidate = {
  type?: unknown;
  scores?: unknown;
};

export function isInitResponseCandidate(
  value: unknown
): value is InitResponseCandidate {
  return typeof value === 'object' && value !== null;
}
