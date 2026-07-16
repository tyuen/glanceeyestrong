import { useEffect, useRef } from 'react';
import { useSelector } from '@xstate/react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import styles from './App.module.css';
import { EndingScreen } from './components/EndingScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { LevelsScreen } from './components/LevelsScreen';
import { SplashScreen } from './components/SplashScreen';
import { puzzles } from './levels';
import { gameActor } from './machine';
import { loadScores } from './network/loadScores';
import { saveScores } from './network/saveScores';

export default function App() {
  const snapshot = useSelector(gameActor, (state) => state);
  const send = gameActor.send;
  const { context } = snapshot;
  const lastSavedScores = useRef('');
  const endingPageRef = useRef<HTMLDivElement>(null);
  const gameplayPageRef = useRef<HTMLDivElement>(null);
  const levelsPageRef = useRef<HTMLDivElement>(null);
  const splashPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let shouldRestore = true;

    void loadScores()
      .then((scores) => {
        if (shouldRestore) {
          send({ type: 'RESTORE_SCORES', scores });
        }
      })
      .catch((error: unknown) => {
        console.error('Unable to restore scores', error);
      });

    return () => {
      shouldRestore = false;
    };
  }, [send]);

  useEffect(() => {
    if (!snapshot.matches({ level: 'ending' })) {
      return;
    }

    const nextSavedScores = JSON.stringify(context.ownScores);

    if (lastSavedScores.current === nextSavedScores) {
      return;
    }

    lastSavedScores.current = nextSavedScores;

    saveScores(context.ownScores).catch((error: unknown) => {
      console.error('Unable to save scores', error);
    });
  }, [context.ownScores, snapshot]);

  let pageKey = 'gameplay';
  let pageRef = gameplayPageRef;
  let page = (
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

  if (snapshot.matches('splash')) {
    pageKey = 'splash';
    pageRef = splashPageRef;
    page = <SplashScreen onStart={() => send({ type: 'START' })} />;
  } else if (snapshot.matches('levels')) {
    pageKey = 'levels';
    pageRef = levelsPageRef;
    page = (
      <LevelsScreen
        ownScores={context.ownScores}
        onSelectLevel={(level) => send({ type: 'SELECT_LEVEL', level })}
      />
    );
  } else if (snapshot.matches({ level: 'ending' })) {
    pageKey = 'ending';
    pageRef = endingPageRef;
    page = (
      <EndingScreen
        emojis={puzzles[context.currLevel] ?? puzzles[0]!}
        level={context.currLevel + 1}
        score={context.currLevelCorrect}
      />
    );
  }

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames={{
          enter: styles.pageEnter,
          enterActive: styles.pageEnterActive,
          exit: styles.pageExit,
          exitActive: styles.pageExitActive,
        }}
        key={pageKey}
        nodeRef={pageRef}
        timeout={300}
      >
        <div className={styles.pageTransition} ref={pageRef}>
          {page}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
