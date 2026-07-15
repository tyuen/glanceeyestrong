import styles from './EndingScreen.module.css';

type EndingScreenProps = {
  emojis: string[];
  level: number;
  score: number;
};

export function EndingScreen({ emojis, level, score }: EndingScreenProps) {
  const rainEmojis = emojis.flatMap((emoji) => [emoji, emoji, emoji]);

  return (
    <main className="relative flex h-full flex-col items-center justify-center overflow-hidden text-white bg-red-950 bg-[url(/smug.webp)] bg-cover bg-no-repeat bg-center">
      <div className={styles.emojiRain} aria-hidden="true">
        {rainEmojis.map((emoji, index) => (
          <span className={styles.rainEmoji} key={`${emoji}-${index}`}>
            {emoji}
          </span>
        ))}
      </div>
      <div className="flex-4" />
      <section className="relative z-10 w-full p-8 text-center bg-amber-900/80 backdrop-sepia-100 shadow-black/50 shadow-xl">
        <p className="text-lg font-bold uppercase">Level {level} Score</p>
        <h1 className="mt-3 text-7xl font-bold">{score}</h1>
      </section>
      <div className="flex-1" />
    </main>
  );
}
