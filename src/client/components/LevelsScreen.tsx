import { puzzles } from '../levels';
import sharedStyles from '../Shared.module.css';
import { EmojiStack } from './EmojiStack';
import styles from './LevelsScreen.module.css';

type LevelsScreenProps = {
  ownScores: number[];
  onSelectLevel: (level: number) => void;
};

export function LevelsScreen({ ownScores, onSelectLevel }: LevelsScreenProps) {
  return (
    <main className="bg-red-950">
      <img
        src="/livingroom.webp"
        alt="banner"
        className="h-[30vh] w-full object-cover object-[0_35%] mask-b-from-0"
      />
      <section className="mx-auto p-4 sm:p-8 flex w-full max-w-3xl flex-col gap-5 my-[5vh] text-white">
        <div className="grid grid-cols-1 gap-3">
          {puzzles.map((level, index) => {
            const isUnlocked = index === 0 || (ownScores[index - 1] ?? 0) > 0;

            return (
              <button
                className={`grid grid-cols-[6rem_1fr_6rem] items-center text-center p-4 disabled:cursor-not-allowed disabled:opacity-60 rounded-2xl ${styles.levelCard}`}
                disabled={!isUnlocked}
                key={level.join('')}
                onClick={() => onSelectLevel(index)}
              >
                <span className="flex flex-col items-center font-bold">
                  <span className={`text-sm ${sharedStyles.labelText}`}>
                    Level
                  </span>
                  <span
                    className={`text-7xl/none ${!isUnlocked && 'opacity-50'}`}
                  >
                    {index + 1}
                  </span>
                </span>

                <EmojiStack emojis={level} />

                <span className="flex flex-col items-center font-bold">
                  <span className={`text-sm ${sharedStyles.labelText}`}>
                    Best
                  </span>
                  <span
                    className={`text-7xl/none ${!isUnlocked && 'opacity-50'} ${styles.bestScoreValue}`}
                  >
                    {ownScores[index] ?? 0}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
