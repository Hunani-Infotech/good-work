import { useEffect } from 'react';
import { initAgencyAnimations, destroyAgencyAnimations } from '../animations/agencyAnimations.js';
import { resetDocumentScrollState } from '../animations/scrollRuntime.js';

export function useAgencyAnimations() {
  useEffect(() => {
    let active = true;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      resetDocumentScrollState({ keepSiteReady: true });
      document.documentElement.classList.remove('site-ready');
      initAgencyAnimations();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      destroyAgencyAnimations();
    };
  }, []);
}
