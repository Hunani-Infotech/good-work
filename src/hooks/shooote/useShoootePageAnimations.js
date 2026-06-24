import { useEffect } from 'react';
import { isLoaderSessionComplete, whenSiteLoaderReady } from '../../animations/loaderAnimations.js';
import { resetDocumentScrollState } from '../../animations/scrollRuntime.js';
import { destroyShoooteAnimations, initShoooteAnimations } from '../../animations/shoooteAnimations.js';

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

export const useShoooteAnimations = createAnimationHook({
  init: initShoooteAnimations,
  destroy: destroyShoooteAnimations,
});
