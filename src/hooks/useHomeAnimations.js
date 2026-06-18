import { useEffect } from 'react';
import { initHomeAnimations, destroyHomeAnimations } from '../animations/homeAnimations.js';
import { resetDocumentScrollState } from '../animations/scrollRuntime.js';

export function useHomeAnimations() {
  useEffect(() => {
    let active = true;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      resetDocumentScrollState();
      initHomeAnimations();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      destroyHomeAnimations();
    };
  }, []);
}
