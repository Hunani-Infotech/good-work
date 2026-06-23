import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bootSiteLoader, skipSiteLoader } from '../animations/loaderAnimations.js';
import { ISAK_CV_PATH, SHOOOTE_CV_PATH } from '../data/cvTemplatePaths.js';

const SKIP_LOADER_PREFIXES = [ISAK_CV_PATH, SHOOOTE_CV_PATH];

function shouldSkipLoader(pathname) {
  return SKIP_LOADER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function useSiteLoader() {
  const location = useLocation();

  useEffect(() => {
    let active = true;

    if (shouldSkipLoader(location.pathname)) {
      skipSiteLoader();
      return () => {
        active = false;
      };
    }

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
