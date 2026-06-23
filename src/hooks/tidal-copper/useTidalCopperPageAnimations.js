import { useEffect } from 'react';
import { isLoaderSessionComplete } from '../../animations/loaderAnimations.js';
import { resetDocumentScrollState } from '../../animations/scrollRuntime.js';
import {
  destroyTidalCopperAnimations,
  initTidalCopperAnimations,
} from '../../animations/tidalCopperAnimations.js';

function createAnimationHook({ init, destroy, resetScroll = true }) {
  let mountCount = 0;

  return function usePageAnimations() {
    useEffect(() => {
      let active = true;
      mountCount += 1;

      const frame = window.requestAnimationFrame(() => {
        if (!active) return;
        if (resetScroll) {
          resetDocumentScrollState({ keepSiteReady: true });
          if (!isLoaderSessionComplete()) {
            document.documentElement.classList.remove('site-ready');
          }
        }
        init();
      });

      return () => {
        active = false;
        window.cancelAnimationFrame(frame);
        mountCount -= 1;
        window.setTimeout(() => {
          if (mountCount === 0) destroy();
        }, 0);
      };
    }, []);
  };
}

export const useTidalCopperAnimations = createAnimationHook({
  init: initTidalCopperAnimations,
  destroy: destroyTidalCopperAnimations,
});
