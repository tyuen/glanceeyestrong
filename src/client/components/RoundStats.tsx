type RoundStatsProps = {
  gap: number;
  round: number;
  speed: number;
};

export function RoundStats({ gap, round, speed }: RoundStatsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex justify-between bg-black px-4 py-2 text-sm font-bold text-white">
      <span>Round {round}</span>
      <span>Speed {speed}px/s</span>
      <span>Gap {gap}px</span>
    </div>
  );
}
