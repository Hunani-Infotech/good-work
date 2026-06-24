import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bootSiteLoader } from '../animations/loaderAnimations.js';

export function useSiteLoader() {
  const location = useLocation();

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
  }, [location.pathname]);
}
