import { puzzles } from '../levels';
import { EmojiStack } from './EmojiStack';
import styles from './LevelsScreen.module.css';

type LevelsScreenProps = {
  globalScores: number[];
  ownScores: number[];
  onSelectLevel: (level: number) => void;
};

export function LevelsScreen({
  globalScores,
  ownScores,
  onSelectLevel,
}: LevelsScreenProps) {
  return (
    <main className="bg-red-950">
      <div className="h-[30vh] bg-[url(/livingroom.webp)] bg-position-[0_35%] bg-size-[140%_auto] sm:bg-cover mask-b-from-0" />
      <section className="mx-auto p-4 sm:p-8 flex w-full max-w-3xl flex-col gap-5 my-[5vh] text-white">
        <div className="grid grid-cols-1 gap-3">
          {puzzles.map((level, index) => {
            const isUnlocked = index === 0 || (ownScores[index - 1] ?? 0) > 0;

            return (
              <button
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-2 items-center text-center p-4 disabled:cursor-not-allowed disabled:opacity-60 enabled:border-black/50 enabled:border-b-2 rounded-2xl ${styles.levelCard}`}
                disabled={!isUnlocked}
                key={level.join('')}
                onClick={() => onSelectLevel(index)}
              >
                <span className="flex flex-col items-center font-bold">
                  <span className="text-sm text-stone-400">Level</span>
                  <span
                    className={`text-2xl/none md:text-7xl/none ${!isUnlocked && 'opacity-50'}`}
                  >
                    {index + 1}
                  </span>
                </span>

                <EmojiStack emojis={level} />

                <span className="flex flex-col items-center font-bold">
                  <span className="text-sm text-stone-400">Mine</span>
                  <span
                    className={`text-2xl/none md:text-7xl/none ${!isUnlocked && 'opacity-50'}`}
                  >
                    {ownScores[index] ?? 0}
                  </span>
                </span>

                <span className="flex flex-col items-center font-bold">
                  <span className="text-sm text-stone-400">World</span>
                  <span
                    className={`text-2xl/none md:text-7xl/none ${!isUnlocked && 'opacity-50'}`}
                  >
                    {globalScores[index] ?? 0}
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
