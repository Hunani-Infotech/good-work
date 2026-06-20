import { useEffect } from 'react';
import { initWorkAnimations, destroyWorkAnimations } from '../animations/workAnimations.js';
import { isLoaderSessionComplete } from '../animations/loaderAnimations.js';
import { resetDocumentScrollState } from '../animations/scrollRuntime.js';

let workMountCount = 0;

export function useWorkAnimations() {
  useEffect(() => {
    let active = true;
    workMountCount += 1;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      resetDocumentScrollState({ keepSiteReady: true });
      if (!isLoaderSessionComplete()) {
        document.documentElement.classList.remove('site-ready');
      }
      initWorkAnimations();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      workMountCount -= 1;

      window.setTimeout(() => {
        if (workMountCount === 0) {
          destroyWorkAnimations();
        }
      }, 0);
    };
  }, []);
}
