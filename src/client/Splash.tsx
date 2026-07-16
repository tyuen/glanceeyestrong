import styles from './Splash.module.css';

import { requestExpandedMode } from '@devvit/web/client';
import { MouseEventHandler, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const levelOneEmojis = ['🙈', '🙉', '🙊'];
const centerEmoji = levelOneEmojis[1] ?? '🙉';

const play: MouseEventHandler = (e) => {
  requestExpandedMode(e.nativeEvent, 'App');
};

export const Splash = () => {
  return (
    <div className={styles.root}>
      <main className={styles.stage}>
        <div className={styles.playfield}>
          <div className={styles.leftCurtain} />
          <div className={styles.emoji} onClick={play}>
            {centerEmoji}
          </div>
          <div className={styles.rightCurtain} />

          <img
            src="/avatar.webp"
            alt=""
            className={styles.avatar}
            onClick={play}
          />
        </div>

        <div className={styles.controlPanel}>
          <div className={styles.panelSpacer} />
          <div className={styles.answerButtons}>
            {levelOneEmojis.map((emoji) => (
              <button
                className={styles.answerButton}
                key={emoji}
                onClick={play}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className={styles.panelSpacer} />
        </div>
      </main>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
