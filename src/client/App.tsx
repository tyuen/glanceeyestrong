import { useEffect, useRef } from 'react';
import { useSelector } from '@xstate/react';
import type { InitResponse, SaveScoresRequest } from '../shared/api';
import { EndingScreen } from './components/EndingScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { LevelsScreen } from './components/LevelsScreen';
import { SplashScreen } from './components/SplashScreen';
import { gameActor } from './machine';

type InitResponseCandidate = {
  type?: unknown;
  scores?: unknown;
};

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'number' && Number.isFinite(item))
  );
}

function isInitResponseCandidate(value: unknown): value is InitResponseCandidate {
  return typeof value === 'object' && value !== null;
}

function isInitResponse(value: unknown): value is InitResponse {
  return (
    isInitResponseCandidate(value) &&
    value.type === 'init' &&
    isNumberArray(value.scores)
  );
}

async function loadScores(): Promise<number[]> {
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

async function saveScores(scores: number[]): Promise<void> {
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

export default function App() {
  const snapshot = useSelector(gameActor, (state) => state);
  const send = gameActor.send;
  const { context } = snapshot;
  const lastSavedScores = useRef('');

  useEffect(() => {
    let shouldRestore = true;

    void loadScores()
      .then((scores) => {
        if (shouldRestore) {
          send({ type: 'RESTORE_SCORES', scores });
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to restore scores', error);
      });

    return () => {
      shouldRestore = false;
    };
  }, [send]);

  useEffect(() => {
    if (!snapshot.matches({ level: 'ending' })) {
      return;
    }

    const nextSavedScores = JSON.stringify(context.ownScores);

    if (lastSavedScores.current === nextSavedScores) {
      return;
    }

    lastSavedScores.current = nextSavedScores;

    void saveScores(context.ownScores).catch((error: unknown) => {
      console.error('Unable to save scores', error);
    });
  }, [context.ownScores, snapshot]);

  if (snapshot.matches('splash')) {
    return <SplashScreen onStart={() => send({ type: 'START' })} />;
  }

  if (snapshot.matches('levels')) {
    return (
      <LevelsScreen
        ownScores={context.ownScores}
        onSelectLevel={(level) => send({ type: 'SELECT_LEVEL', level })}
      />
    );
  }

  if (snapshot.matches({ level: 'ending' })) {
    return (
      <EndingScreen
        level={context.currLevel + 1}
        score={context.currLevelCorrect}
      />
    );
  }

  return (
    <GameplayScreen
      context={context}
      isShowingMissFeedback={snapshot.matches({
        level: { playing: 'feedback' },
      })}
      isSliding={snapshot.matches({ level: { playing: 'sliding' } })}
      onExit={() => send({ type: 'EXIT_LEVEL' })}
      onSlideDone={() => send({ type: 'SLIDE_DONE' })}
      onSubmit={(emojiIndex) => send({ type: 'SUBMIT', emojiIndex })}
    />
  );
}
