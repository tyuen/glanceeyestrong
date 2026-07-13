import { isInitResponse } from '../utils/isInitResponse';

export async function loadScores(): Promise<number[]> {
  const response = await fetch('/api/init');

  if (!response.ok) {
    throw new Error(`Failed to load scores: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isInitResponse(payload)) {
    throw new Error('Invalid init response');
  }

  return payload.scores;
}
