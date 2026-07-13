import type { SaveScoresRequest } from '../../shared/api';

export async function saveScores(scores: number[]): Promise<void> {
  const body: SaveScoresRequest = { scores };
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
}
