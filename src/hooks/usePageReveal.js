import { useEffect } from 'react';
import { revealSiteContent, whenSiteLoaderReady } from '../animations/loaderAnimations.js';

export function usePageReveal() {
  useEffect(() => {
    let active = true;

    whenSiteLoaderReady().then(() => {
      if (active) revealSiteContent();
    });

    return () => {
      active = false;
    };
  }, []);
}
