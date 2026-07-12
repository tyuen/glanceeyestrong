// import { context, requestExpandedMode } from "@devvit/web/client";
import { useSelector } from '@xstate/react';
import { EndingScreen } from './components/EndingScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { LevelsScreen } from './components/LevelsScreen';
import { SplashScreen } from './components/SplashScreen';
import { gameActor } from './machine';

export default function App() {
  const snapshot = useSelector(gameActor, (state) => state);
  const send = gameActor.send;
  const { context } = snapshot;

  if (snapshot.matches('splash')) {
    return <SplashScreen onStart={() => send({ type: 'START' })} />;
  }

  if (snapshot.matches('levels')) {
    return (
      <LevelsScreen
        ownScores={context.ownScores}
        onSelectLevel={(level) => send({ type: 'SELECT_LEVEL', level })}
      />
    );
  }

  if (snapshot.matches({ level: 'ending' })) {
    return (
      <EndingScreen
        level={context.currLevel + 1}
        score={context.currLevelCorrect}
      />
    );
  }

  return (
    <GameplayScreen
      context={context}
      isShowingMissFeedback={snapshot.matches({
        level: { playing: 'feedback' },
      })}
      isSliding={snapshot.matches({ level: { playing: 'sliding' } })}
      onExit={() => send({ type: 'EXIT_LEVEL' })}
      onSlideDone={() => send({ type: 'SLIDE_DONE' })}
      onSubmit={(emojiIndex) => send({ type: 'SUBMIT', emojiIndex })}
    />
  );
}
