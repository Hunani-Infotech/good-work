import { useEffect } from 'react';
import { resetDocumentScrollState } from '../../animations/scrollRuntime.js';
import { destroyShoooteAnimations, initShoooteAnimations } from '../../animations/shoooteAnimations.js';

function waitForPreloaderHidden() {
  return new Promise((resolve) => {
    const preloader = document.querySelector('.preloader');
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

    observer.observe(preloader, { attributes: true, attributeFilter: ['class'] });
    window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 1500);
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
        await waitForPreloaderHidden();
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
