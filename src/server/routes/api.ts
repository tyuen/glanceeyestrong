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

const MAX_SCORES = 100;

const K_SCORE = 'my_scores';
const K_GLOBAL_SCORE = `global_scores`;

function normalizeLevel(value: unknown): number | null {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 0 ||
    value >= MAX_SCORES
  ) {
    return null;
  }

  return value;
}

function normalizeScore(value: unknown): number {
  const score = typeof value === 'string' ? Number(value) : value;

  return typeof score === 'number' && Number.isFinite(score)
    ? Math.max(0, Math.floor(score))
    : 0;
}

function trimTrailingZeroes(scores: number[]): number[] {
  let lastScoreIndex = scores.length - 1;

  while (lastScoreIndex >= 0 && scores[lastScoreIndex] === 0) {
    lastScoreIndex -= 1;
  }

  return scores.slice(0, lastScoreIndex + 1);
}

function parseScoreFields(fields: Record<string, string>): number[] {
  const scores: number[] = [];

  Object.entries(fields).forEach(([level, score]) => {
    const index = Number(level);

    if (Number.isInteger(index) && index >= 0 && index < MAX_SCORES) {
      scores[index] = normalizeScore(Number(score));
    }
  });

  return trimTrailingZeroes(scores.map((score) => score ?? 0));
}

function getScoresKey(username: string): string {
  return `${K_SCORE}:${username}`;
}

async function getScores(key: string): Promise<number[]> {
  return parseScoreFields(await redis.hGetAll(key));
}

async function setScore(
  key: string,
  level: number,
  score: number
): Promise<void> {
  await redis.hSet(key, { [`${level}`]: `${score}` });
}

async function saveBestScore(
  key: string,
  level: number,
  score: number
): Promise<void> {
  const currentScore = normalizeScore(await redis.hGet(key, `${level}`));

  if (score > currentScore) {
    await setScore(key, level, score);
  }
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
    const [username, globalScores] = await Promise.all([
      reddit.getCurrentUsername(),
      getScores(K_GLOBAL_SCORE),
    ]);
    const currentUsername = username ?? 'anonymous';
    const scores = await getScores(getScoresKey(currentUsername));

    return c.json<InitResponse>({
      type: 'init',
      postId,
      scores,
      global_scores: globalScores,
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
    const level = normalizeLevel(input.level);

    if (level === null) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Invalid score level' },
        400
      );
    }

    const score = normalizeScore(input.score);
    const scoreKey = getScoresKey(username);

    await Promise.all([
      saveBestScore(scoreKey, level, score),
      saveBestScore(K_GLOBAL_SCORE, level, score),
    ]);
    const [scores, globalScores] = await Promise.all([
      getScores(scoreKey),
      getScores(K_GLOBAL_SCORE),
    ]);

    return c.json<SaveScoresResponse>(
      {
        type: 'scores-saved',
        scores,
        global_scores: globalScores,
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
