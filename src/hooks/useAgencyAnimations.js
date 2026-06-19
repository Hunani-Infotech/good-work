import { useEffect } from 'react';
import { initAgencyAnimations, destroyAgencyAnimations } from '../animations/agencyAnimations.js';

export function useAgencyAnimations() {
  useEffect(() => {
    initAgencyAnimations();
    return () => {
      destroyAgencyAnimations();
    };
  }, []);
}
