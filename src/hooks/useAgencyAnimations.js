import { useEffect } from 'react';
import { initAgencyAnimations, destroyAgencyAnimations } from '../animations/agencyAnimations.js';

let agencyMountCount = 0;

export function useAgencyAnimations() {
  useEffect(() => {
    let active = true;
    agencyMountCount += 1;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;
      initAgencyAnimations();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      agencyMountCount -= 1;

      window.setTimeout(() => {
        if (agencyMountCount === 0) {
          destroyAgencyAnimations();
        }
      }, 0);
    };
  }, []);
}
