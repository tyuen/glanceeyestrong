import styles from './Splash.module.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <div className={styles.flex1} />
        <div className={styles.dialog}>
          <div>
            Is that {context?.username ?? 'a human'} or are my eyes deceiving
            me?
          </div>
          <button
            className={styles.button}
            onClick={(e) => requestExpandedMode(e.nativeEvent, 'App')}
          >
            Tap to Play
          </button>
        </div>
        <div className={styles.flex2} />
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
