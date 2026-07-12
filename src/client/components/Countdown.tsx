import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";
import { levelsDuration } from "../levels";
import { gameActor } from "../machine";

export function Countdown() {
  const startTime = useSelector(
    gameActor,
    (state) => state.context.currLevelStartTime,
  );
  const [now, setNow] = useState(startTime);
  const elapsedSeconds = Math.max(0, (now - startTime) / 1000);
  const remainingSeconds =
    startTime === 0
      ? levelsDuration
      : Math.max(0, Math.ceil(levelsDuration - elapsedSeconds));

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 250);

    return () => window.clearInterval(intervalId);
  }, [startTime]);

  return remainingSeconds;
}
