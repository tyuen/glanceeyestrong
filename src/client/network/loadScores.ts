import { isInitResponse } from '../utils/isInitResponse';

export type LoadedScores = {
  scores: number[];
  globalScores: number[];
};

export async function loadScores(): Promise<LoadedScores> {
  const response = await fetch('/api/init');

  if (!response.ok) {
    throw new Error(`Failed to load scores: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isInitResponse(payload)) {
    throw new Error('Invalid init response');
  }

  return {
    scores: payload.scores,
    globalScores: payload.global_scores,
  };
}
