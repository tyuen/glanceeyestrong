import type { ReactNode } from "react";
import styles from "../Shared.module.css";

type ScoreMetricProps = {
  label: string;
  value: ReactNode;
};

export function ScoreMetric({ label, value }: ScoreMetricProps) {
  return (
    <div>
      <p className={`text-xs font-bold ${styles.labelText}`}>{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
