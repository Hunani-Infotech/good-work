import { useEffect } from 'react';
import { initHomeAnimations, destroyHomeAnimations } from '../animations/homeAnimations.js';
import { isLoaderSessionComplete } from '../animations/loaderAnimations.js';
import { resetDocumentScrollState } from '../animations/scrollRuntime.js';

let homeMountCount = 0;

export function useHomeAnimations() {
  useEffect(() => {
    let active = true;
    homeMountCount += 1;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      resetDocumentScrollState({ keepSiteReady: true });
      if (!isLoaderSessionComplete()) {
        document.documentElement.classList.remove('site-ready');
      }
      initHomeAnimations();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      homeMountCount -= 1;

      window.setTimeout(() => {
        if (homeMountCount === 0) {
          destroyHomeAnimations();
        }
      }, 0);
    };
  }, []);
}
