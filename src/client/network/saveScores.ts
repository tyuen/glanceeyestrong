import type { SaveScoresRequest, SaveScoresResponse } from '../../shared/api';
import { isNumberArray } from '../utils/isNumberArray';

function isSaveScoresResponse(value: unknown): value is SaveScoresResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'scores' in value &&
    'global_scores' in value &&
    value.type === 'scores-saved' &&
    isNumberArray(value.scores) &&
    isNumberArray(value.global_scores)
  );
}

export type SavedScores = {
  scores: number[];
  globalScores: number[];
};

export async function saveScores(
  level: number,
  score: number
): Promise<SavedScores> {
  const body: SaveScoresRequest = { level, score };
  const response = await fetch('/api/scores', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to save scores: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isSaveScoresResponse(payload)) {
    throw new Error('Invalid save scores response');
  }

  return {
    scores: payload.scores,
    globalScores: payload.global_scores,
  };
}
