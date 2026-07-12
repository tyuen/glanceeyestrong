import type { CSSProperties } from 'react';
import { puzzles, levelsDuration } from '../levels';
import type { GameContext } from '../machine';
import sharedStyles from '../Shared.module.css';
import { AnswerButtons } from './AnswerButtons';
import { Countdown } from './Countdown';
import styles from './GameplayScreen.module.css';
import { ScoreMetric } from './ScoreMetric';

type GameplayScreenProps = {
  context: GameContext;
  isShowingMissFeedback: boolean;
  isSliding: boolean;
  onExit: () => void;
  onSlideDone: () => void;
  onSubmit: (emojiIndex: number) => void;
};

export function GameplayScreen({
  context,
  isShowingMissFeedback,
  isSliding,
  onExit,
  onSlideDone,
  onSubmit,
}: GameplayScreenProps) {
  const levelEmojis = puzzles[context.currLevel]!;
  const round = context.currentRound;
  const durationSeconds = Math.max(1.2, (levelsDuration * 10) / round.speed);
  const roundStyle = {
    '--gap-width': `${round.gap}px`,
    '--fly-duration': `${durationSeconds}s`,
  } as CSSProperties;
  const playfieldClassName = [
    'relative min-h-0 w-full flex-1 overflow-hidden',
    styles.playfield,
    isShowingMissFeedback && context.lastRoundResult === 'missed'
      ? styles.missedPlayfield
      : '',
    isShowingMissFeedback && context.lastRoundResult === 'wrong'
      ? styles.wrongPlayfield
      : '',
  ].join(' ');

  return (
    <main
      className={`relative flex h-svh flex-col text-white ${sharedStyles.appBackdrop}`}
    >
      <button
        className="absolute left-0 top-0 z-50 flex h-12 w-12 items-center justify-center text-3xl/none text-white opacity-50"
        onClick={onExit}
      >
        &larr;
      </button>

      <section className="flex min-h-0 w-full flex-1 flex-col">
        <div className={playfieldClassName} style={roundStyle}>
          <div
            className={`absolute top-1/2 z-10 text-[min(50vh,150px)] leading-none opacity-0 data-[active=true]:opacity-100 ${styles.flyingEmoji}`}
            data-active={isSliding}
            data-direction={round.direction}
            data-paused={!isSliding}
            key={round.id}
            onAnimationEnd={onSlideDone}
          >
            {round.emoji}
          </div>
          <div
            className={`absolute inset-y-0 left-0 z-20 w-[calc((100%-var(--gap-width))/2)] ${styles.leftCurtain}`}
          />
          <div
            className={`absolute inset-y-0 right-0 z-20 w-[calc((100%-var(--gap-width))/2)] ${styles.rightCurtain}`}
          />
        </div>

        <div
          className={`flex items-center justify-between gap-4 px-4 py-3 ${styles.woodPanel}`}
        >
          <div className="flex-1 hidden md:flex">
            <img
              src="/avatar.webp"
              alt="avatar"
              className="size-20 rounded-xl bg-red-500/50 border-red-900 border"
            />
          </div>

          <div className="flex min-w-0 items-center self-stretch justify-start">
            <AnswerButtons
              context={context}
              disabled={!isSliding}
              emojis={levelEmojis}
              onSubmit={onSubmit}
            />
          </div>

          <div className="flex-1">
            <div
              className={`flex justify-self-end gap-4 px-3 py-2 text-center rounded-xl ${styles.woodPanel}`}
            >
              <ScoreMetric label="Duration" value={<Countdown />} />
              <ScoreMetric label="Level" value={context.currLevel + 1} />
              <ScoreMetric label="Score" value={context.currLevelCorrect} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
