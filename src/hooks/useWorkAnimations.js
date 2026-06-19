import { useEffect } from 'react';
import { initWorkAnimations, destroyWorkAnimations } from '../animations/workAnimations.js';
import { resetDocumentScrollState } from '../animations/scrollRuntime.js';

export function useWorkAnimations() {
  useEffect(() => {
    let active = true;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      resetDocumentScrollState({ keepSiteReady: true });
      document.documentElement.classList.remove('site-ready');
      initWorkAnimations();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      destroyWorkAnimations();
    };
  }, []);
}
