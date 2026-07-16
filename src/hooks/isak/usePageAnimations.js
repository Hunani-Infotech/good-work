import { useEffect } from 'react';
import { isLoaderSessionComplete, whenSiteLoaderReady } from '../../animations/loaderAnimations.js';
import { resetDocumentScrollState, syncScrollLayout } from '../../animations/scrollRuntime.js';
import { destroyIsakAnimations, initIsakAnimations } from '../../animations/isakAnimations.js';

function createAnimationHook({ init, destroy, resetScroll = true }) {
  let mountCount = 0;

  return function usePageAnimations() {
    useEffect(() => {
      let active = true;
      mountCount += 1;

      const boot = async () => {
        if (resetScroll) {
          resetDocumentScrollState({ keepSiteReady: true });
          if (!isLoaderSessionComplete()) {
            document.documentElement.classList.remove('site-ready');
          }
        }
        await whenSiteLoaderReady();
        if (!active) return;
        init();
        window.requestAnimationFrame(() => {
          if (active) syncScrollLayout();
        });
      };

      boot();

      return () => {
        active = false;
        mountCount -= 1;
        window.setTimeout(() => {
          if (mountCount === 0) destroy();
        }, 0);
      };
    }, []);
  };
}

export const useIsakAnimations = createAnimationHook({
  init: initIsakAnimations,
  destroy: destroyIsakAnimations,
  resetScroll: false,
});
