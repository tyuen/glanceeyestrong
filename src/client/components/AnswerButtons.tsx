import { useEffect } from 'react';
import type { GameContext } from '../machine';
import styles from './AnswerButtons.module.css';

type AnswerButtonsProps = {
  context: GameContext;
  disabled: boolean;
  emojis: string[];
  onSubmit: (emojiIndex: number) => void;
};

export function AnswerButtons({
  context,
  disabled,
  emojis,
  onSubmit,
}: AnswerButtonsProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (disabled || event.repeat) {
        return;
      }

      const emojiIndex = Number(event.key) - 1;

      if (
        !Number.isInteger(emojiIndex) ||
        emojiIndex < 0 ||
        emojiIndex >= emojis.length
      ) {
        return;
      }

      onSubmit(emojiIndex);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, emojis.length, onSubmit]);

  return (
    <div className="flex h-full items-stretch gap-3">
      {emojis.map((emoji, index) => (
        <button
          className={`flex aspect-square rounded-xl gap-0.5 flex-col items-center justify-center border p-1 leading-none text-white ${styles.answerChoice} ${getAnswerButtonClassName(
            context,
            index
          )}`}
          data-testid={`answer-choice-${index}`}
          disabled={disabled}
          key={emoji}
          onClick={() => onSubmit(index)}
        >
          <span className="text-[4rem] leading-none">{emoji}</span>
          <span
            className={`text-[0.8rem] font-extrabold leading-none ${styles.shortcutNumber}`}
            aria-hidden="true"
          >
            {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
}

function getAnswerButtonClassName(context: GameContext, index: number) {
  if (
    context.lastRoundResult === 'missed' &&
    context.currentRound.emojiIndex === index
  ) {
    return styles.wrongAnswerButton;
  }

  if (context.lastSubmittedEmojiIndex !== index) {
    return styles.answerButton;
  }

  if (context.lastRoundResult === 'correct') {
    return styles.correctAnswerButton;
  }

  if (context.lastRoundResult === 'wrong') {
    return styles.wrongAnswerButton;
  }

  return styles.answerButton;
}
