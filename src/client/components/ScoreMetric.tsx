import { type ReactNode, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import styles from './ScoreMetric.module.css';

type ScoreMetricProps = {
  animate?: boolean;
  label: string;
  testId?: string;
  value: ReactNode;
};

export function ScoreMetric({
  animate = false,
  label,
  testId,
  value,
}: ScoreMetricProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const valueKey = String(value);

  return (
    <div data-testid={testId}>
      <p className="text-xs font-bold opacity-50">{label}</p>
      <p className="text-2xl font-bold">
        {animate ? (
          <span className={styles.animatedValue}>
            <SwitchTransition>
              <CSSTransition
                classNames={{
                  enter: styles.scoreEnter,
                  enterActive: styles.scoreEnterActive,
                  exit: styles.scoreExit,
                  exitActive: styles.scoreExitActive,
                }}
                key={valueKey}
                nodeRef={nodeRef}
                timeout={900}
              >
                <span className={styles.scoreValue} ref={nodeRef}>
                  {value}
                </span>
              </CSSTransition>
            </SwitchTransition>
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
