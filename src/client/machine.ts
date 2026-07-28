import { assign, createActor, setup } from 'xstate';
import {
  accelerationPerRound,
  accelerateGapReduce,
  genRand,
  levelsDuration,
  maxSpeed,
  minGap,
  puzzles,
  startGap,
  startSpeed,
} from './levels';

type Direction = 'left' | 'right';

export type Round = {
  id: number;
  emoji: string;
  emojiIndex: number;
  direction: Direction;
  speed: number;
  gap: number;
};

export type GameContext = {
  ownScores: number[];
  globalScores: number[];
  currLevel: number;
  currLevelStartTime: number;
  currLevelRound: number;
  currLevelCorrect: number;
  currentRound: Round;
  lastSubmittedEmojiIndex: number | null;
  lastRoundResult: 'correct' | 'wrong' | 'missed' | null;
};

type GameEvent =
  | { type: 'START' }
  | { type: 'EXIT_LEVEL' }
  | { type: 'RESTORE_SCORES'; scores: number[]; globalScores: number[] }
  | { type: 'RESTORE_GLOBAL_SCORES'; globalScores: number[] }
  | { type: 'SELECT_LEVEL'; level: number }
  | { type: 'SUBMIT'; emojiIndex: number }
  | { type: 'SLIDE_DONE' };

// const emptyRound: Round = {
//   id: 0,
//   emoji: puzzles[0]![0]!,
//   emojiIndex: 0,
//   direction: 'right',
//   speed: startSpeed,
//   gap: startGap,
// };

function createRound(level: number, round: number): Round {
  const levelPuzzles = puzzles[level] ?? puzzles[0]!;
  const emojiIndex = Math.floor(genRand() * levelPuzzles.length);
  const direction = genRand() > 0.5 ? 'right' : 'left';

  return {
    id: round,
    emoji: levelPuzzles[emojiIndex]!,
    emojiIndex,
    direction,
    speed: Math.min(maxSpeed, startSpeed + round * accelerationPerRound),
    gap: Math.max(minGap, startGap - round * accelerateGapReduce),
  };
}

const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  actions: {
    startLevel: assign(({ event }) => {
      const level = event.type === 'SELECT_LEVEL' ? event.level : 0;

      return {
        currLevel: level,
        currLevelStartTime: 0,
        currLevelRound: 0,
        currLevelCorrect: 0,
        currentRound: createRound(level, 0),
        lastSubmittedEmojiIndex: null,
        lastRoundResult: null,
      };
    }),
    startLevelTimer: assign({
      currLevelStartTime: () => Date.now(),
    }),
    scoreCorrectAnswer: assign(({ context, event }) => {
      return {
        currLevelCorrect: context.currLevelCorrect + 1,
        lastSubmittedEmojiIndex:
          event.type === 'SUBMIT' ? event.emojiIndex : null,
        lastRoundResult: 'correct',
      };
    }),
    markWrongAnswer: assign(({ event }) => {
      return {
        lastSubmittedEmojiIndex:
          event.type === 'SUBMIT' ? event.emojiIndex : null,
        lastRoundResult: 'wrong',
      };
    }),
    markMissedRound: assign({
      lastSubmittedEmojiIndex: null,
      lastRoundResult: 'missed',
    }),
    nextRound: assign(({ context }) => {
      const nextRound = context.currLevelRound + 1;

      return {
        currLevelRound: nextRound,
        currentRound: createRound(context.currLevel, nextRound),
        lastSubmittedEmojiIndex: null,
        lastRoundResult: null,
      };
    }),
    saveScore: assign(({ context }) => {
      const ownScores = [...context.ownScores];
      ownScores[context.currLevel] = Math.max(
        ownScores[context.currLevel] ?? 0,
        context.currLevelCorrect
      );

      return { ownScores };
    }),
    restoreScores: assign(({ event }) => {
      if (event.type !== 'RESTORE_SCORES') {
        return {};
      }

      return {
        ownScores: event.scores,
        globalScores: event.globalScores,
      };
    }),
    restoreGlobalScores: assign(({ event }) => {
      if (event.type !== 'RESTORE_GLOBAL_SCORES') {
        return {};
      }

      return { globalScores: event.globalScores };
    }),
  },
  guards: {
    canSelectLevel: ({ context, event }) =>
      event.type === 'SELECT_LEVEL' &&
      (event.level === 0 || (context.ownScores[event.level - 1] ?? 0) > 0),
    isCorrectAnswer: ({ context, event }) =>
      event.type === 'SUBMIT' &&
      event.emojiIndex === context.currentRound.emojiIndex,
  },
}).createMachine({
  id: 'game',
  initial: 'level', // 'levels',
  context: {
    ownScores: [],
    globalScores: [],
    currLevel: 0,
    currLevelStartTime: Date.now(), // 0,
    currLevelRound: 0,
    currLevelCorrect: 0,
    currentRound: createRound(0, 0), // emptyRound,
    lastSubmittedEmojiIndex: null,
    lastRoundResult: null,
  },
  on: {
    RESTORE_SCORES: {
      actions: 'restoreScores',
    },
    RESTORE_GLOBAL_SCORES: {
      actions: 'restoreGlobalScores',
    },
  },
  states: {
    splash: {
      on: {
        START: 'levels',
      },
    },
    levels: {
      on: {
        SELECT_LEVEL: {
          guard: 'canSelectLevel',
          target: 'level.starting',
          actions: 'startLevel',
        },
      },
    },
    level: {
      initial: 'playing', // 'starting',
      on: {
        EXIT_LEVEL: '#game.levels',
      },
      states: {
        starting: {
          after: {
            [1500]: {
              target: 'playing',
              actions: 'startLevelTimer',
            },
          },
        },
        playing: {
          initial: 'sliding',
          after: {
            [levelsDuration * 1000]: {
              target: 'ending',
              actions: 'saveScore',
            },
          },
          states: {
            sliding: {
              on: {
                SUBMIT: [
                  {
                    guard: 'isCorrectAnswer',
                    target: 'cooldown',
                    actions: 'scoreCorrectAnswer',
                  },
                  {
                    target: 'feedback',
                    actions: 'markWrongAnswer',
                  },
                ],
                SLIDE_DONE: {
                  target: 'feedback',
                  actions: 'markMissedRound',
                },
              },
            },
            feedback: {
              after: {
                1000: {
                  target: 'cooldownAfterFeedback',
                },
              },
            },
            cooldown: {
              after: {
                2000: {
                  target: 'sliding',
                  actions: 'nextRound',
                },
              },
            },
            cooldownAfterFeedback: {
              after: {
                1000: {
                  target: 'sliding',
                  actions: 'nextRound',
                },
              },
            },
          },
        },
        ending: {
          after: {
            3000: '#game.levels',
          },
        },
      },
    },
  },
});

export const gameActor = createActor(gameMachine).start();
