import { useEffect } from 'react';
import { resetDocumentScrollState, syncScrollLayout } from '../../animations/scrollRuntime.js';
import { destroyIsakAnimations, initIsakAnimations } from '../../animations/isakAnimations.js';

function waitForIsakPreloader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preload');
    if (!preloader || preloader.classList.contains('is-hidden')) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (preloader.classList.contains('is-hidden')) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(preloader, { attributes: true, attributeFilter: ['class', 'style'] });
    window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 1200);
  });
}

function createAnimationHook({ init, destroy, resetScroll = true }) {
  let mountCount = 0;

  return function usePageAnimations() {
    useEffect(() => {
      let active = true;
      mountCount += 1;

      const boot = async () => {
        if (resetScroll) {
          resetDocumentScrollState({ keepSiteReady: true });
        }
        await waitForIsakPreloader();
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
