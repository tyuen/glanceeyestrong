import type { ReactNode } from 'react';

type ScoreMetricProps = {
  label: string;
  value: ReactNode;
};

export function ScoreMetric({ label, value }: ScoreMetricProps) {
  return (
    <div>
      <p className="text-xs font-bold opacity-50">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
