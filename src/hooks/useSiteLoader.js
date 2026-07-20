import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { bootSiteLoader, bypassSiteLoader } from '../animations/loaderAnimations.js';
import {
  GEROZ_CV_PATH,
  ISAK_CV_PATH,
  MERIDIAN_CV_PATH,
  SHOOOTE_CV_PATH,
  TIDAL_COPPER_CV_PATH,
} from '../data/cvTemplatePaths.js';

/** Routes that play the brand loader. Everything else (404) skips it. */
const SITE_LOADER_ROUTES = [
  { path: '/', end: true },
  { path: '/admin', end: true },
  { path: '/cv/sanjay', end: true },
  { path: TIDAL_COPPER_CV_PATH, end: true },
  { path: ISAK_CV_PATH, end: true },
  { path: `${ISAK_CV_PATH}/*`, end: false },
  { path: SHOOOTE_CV_PATH, end: true },
  { path: `${SHOOOTE_CV_PATH}/*`, end: false },
  { path: GEROZ_CV_PATH, end: true },
  { path: `${GEROZ_CV_PATH}/*`, end: false },
  { path: MERIDIAN_CV_PATH, end: true },
  { path: `${MERIDIAN_CV_PATH}/*`, end: false },
];

export function shouldShowSiteLoader(pathname) {
  return SITE_LOADER_ROUTES.some((route) =>
    matchPath({ path: route.path, end: route.end }, pathname),
  );
}

export function useSiteLoader() {
  const location = useLocation();

  useEffect(() => {
    let active = true;

    const frame = window.requestAnimationFrame(() => {
      if (!active) return;

      if (!shouldShowSiteLoader(location.pathname)) {
        bypassSiteLoader();
        return;
      }

      bootSiteLoader();
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);
}
