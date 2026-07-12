import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import type {
  InitResponse,
  SaveScoresRequest,
  SaveScoresResponse,
} from '../../shared/api';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();

function normalizeScores(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((score) =>
    typeof score === 'number' && Number.isFinite(score)
      ? Math.max(0, Math.floor(score))
      : 0
  );
}

function parseScores(value: string | undefined): number[] {
  if (!value) {
    return [];
  }

  try {
    return normalizeScores(JSON.parse(value));
  } catch {
    return [];
  }
}

function getScoresKey(username: string): string {
  return `scores:${username}`;
}

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [levels, username] = await Promise.all([
      redis.get('levels'),
      reddit.getCurrentUsername(),
    ]);
    const currentUsername = username ?? 'anonymous';
    const scores = await redis.get(getScoresKey(currentUsername));

    return c.json<InitResponse>({
      type: 'init',
      postId,
      levels: levels ?? '',
      scores: parseScores(scores),
      username: currentUsername,
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/scores', async (c) => {
  try {
    const input = await c.req.json<SaveScoresRequest>();
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const scores = normalizeScores(input.scores);

    await redis.set(getScoresKey(username), JSON.stringify(scores));

    return c.json<SaveScoresResponse>(
      {
        type: 'scores-saved',
        scores,
      },
      200
    );
  } catch (error) {
    console.error('API Save Scores Error:', error);
    let errorMessage = 'Unknown error while saving scores';
    if (error instanceof Error) {
      errorMessage = `Saving scores failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});
