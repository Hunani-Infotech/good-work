import { useEffect } from 'react';
import { isLoaderSessionComplete } from '../../animations/loaderAnimations.js';
import { resetDocumentScrollState, syncScrollLayout } from '../../animations/scrollRuntime.js';
import {
  destroyMeridianAnimations,
  initMeridianAnimations,
} from '../../animations/meridianAnimations.js';

let mountCount = 0;

export function useMeridianPageAnimations() {
  useEffect(() => {
    let active = true;
    mountCount += 1;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      resetDocumentScrollState({ keepSiteReady: true });
      if (!isLoaderSessionComplete()) {
        document.documentElement.classList.remove('site-ready');
      }
      initMeridianAnimations().then(() => {
        if (!active) return;
        requestAnimationFrame(() => syncScrollLayout());
      });
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      mountCount -= 1;
      window.setTimeout(() => {
        if (mountCount === 0) destroyMeridianAnimations();
      }, 0);
    };
  }, []);
}
