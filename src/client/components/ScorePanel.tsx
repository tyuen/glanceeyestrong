import { ScoreMetric } from "./ScoreMetric";
import styles from "./ScorePanel.module.css";

type ScorePanelProps = {
  className?: string;
  level: number;
  score: number;
};

export function ScorePanel({ className = "", level, score }: ScorePanelProps) {
  return (
    <div
      className={`flex gap-4 p-3 text-center ${styles.scorePanel} ${className}`}
    >
      <ScoreMetric label="Level" value={level} />
      <ScoreMetric label="Score" value={score} />
    </div>
  );
}
