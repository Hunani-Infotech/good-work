import { useEffect } from 'react';
import { isLoaderSessionComplete } from '../animations/loaderAnimations.js';
import { resetDocumentScrollState } from '../animations/scrollRuntime.js';
import { destroyCvAnimations, initCvPageAnimations } from '../animations/cvAnimations.js';
import { destroyAgencyAnimations, initAgencyAnimations } from '../animations/agencyAnimations.js';

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

export const useCvAnimations = createAnimationHook({
  init: initCvPageAnimations,
  destroy: destroyCvAnimations,
});

export const useAgencyAnimations = createAnimationHook({
  init: initAgencyAnimations,
  destroy: destroyAgencyAnimations,
  resetScroll: false,
});
