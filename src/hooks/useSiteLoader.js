import { useEffect } from 'react';
import { bootSiteLoader } from '../animations/loaderAnimations.js';

export function useSiteLoader() {
  useEffect(() => {
    let active = true;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      bootSiteLoader();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);
}
