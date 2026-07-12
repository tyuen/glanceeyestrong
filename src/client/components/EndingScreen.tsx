type EndingScreenProps = {
  level: number;
  score: number;
};

export function EndingScreen({ level, score }: EndingScreenProps) {
  return (
    <main
      className="flex h-full flex-col items-center justify-center text-white bg-red-950"
      style={{
        background: 'url(/smug.webp) center/cover no-repeat',
      }}
    >
      <div className="flex-1" />
      <section className="w-full p-8 text-center bg-black/70">
        <p className="text-lg font-bold uppercase">Level {level} Score</p>
        <h1 className="mt-3 text-7xl font-bold">{score}</h1>
      </section>
      <div className="flex-6" />
    </main>
  );
}
