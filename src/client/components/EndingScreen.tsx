type EndingScreenProps = {
  level: number;
  score: number;
};

export function EndingScreen({ level, score }: EndingScreenProps) {
  return (
    <main className="flex h-full flex-col items-center justify-center text-white bg-red-950 bg-[url(/smug.webp)] bg-cover bg-no-repeat bg-center">
      <div className="flex-4" />
      <section className="w-full p-8 text-center bg-amber-900/80 backdrop-sepia-100 shadow-black/50 shadow-xl">
        <p className="text-lg font-bold uppercase">Level {level} Score</p>
        <h1 className="mt-3 text-7xl font-bold">{score}</h1>
      </section>
      <div className="flex-1" />
    </main>
  );
}
