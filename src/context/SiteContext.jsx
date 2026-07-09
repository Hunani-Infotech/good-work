import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import defaultSite from '../data/site.json';
import {
  buildShareUrl,
  getPublishedUrl,
  isShareUrlTooLong,
  resolveSiteFromSearchParams,
  validateSiteShape,
} from '../utils/siteShare';

const STORAGE_KEY = 'portfolio-site-v1';

const SiteContext = createContext(null);

function setByPath(obj, path, value) {
  const keys = path.split('.');
  const clone = structuredClone(obj);
  let current = clone;
  for (let i = 0; i < keys.length - 1; i += 1) {
    if (current[keys[i]] == null || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

function ensureSiteDefaults(site) {
  const clone = structuredClone(site);
  if (!clone.home) clone.home = {};
  if (!clone.home.cta && defaultSite.home?.cta) {
    clone.home.cta = structuredClone(defaultSite.home.cta);
  }
  return clone;
}

function readStoredSite() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    validateSiteShape(parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSite(site) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
}

export function SiteProvider({ children }) {
  const [site, setSite] = useState(defaultSite);
  const [loading, setLoading] = useState(true);
  const [shareMode, setShareMode] = useState(null);
  const [shareConfigUrl, setShareConfigUrl] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const fromUrl = await resolveSiteFromSearchParams(window.location.search);
        if (cancelled) return;

        if (fromUrl) {
          setSite(ensureSiteDefaults(fromUrl.site));
          setShareMode(fromUrl.mode);
          setShareConfigUrl(fromUrl.configUrl || '');
          setLoading(false);
          return;
        }

        const stored = readStoredSite();
        setSite(ensureSiteDefaults(stored || defaultSite));
        setShareMode(null);
        setShareConfigUrl('');
      } catch (error) {
        console.error(error);
        setSite(ensureSiteDefaults(readStoredSite() || defaultSite));
        setShareMode(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistSite = useCallback((nextSite) => {
    if (!shareMode) {
      writeStoredSite(nextSite);
    }
  }, [shareMode]);

  const updateSite = useCallback((path, value) => {
    setSite((prev) => {
      const next = setByPath(prev, path, value);
      persistSite(next);
      return next;
    });
  }, [persistSite]);

  const resetSite = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSite(defaultSite);
    setShareMode(null);
    setShareConfigUrl('');
  }, []);

  const exportJson = useCallback(() => JSON.stringify(site, null, 2), [site]);

  const importJson = useCallback((text) => {
    const parsed = JSON.parse(text);
    validateSiteShape(parsed);
    setSite(parsed);
    setShareMode(null);
    setShareConfigUrl('');
    writeStoredSite(parsed);
  }, []);

  const importSharedPreview = useCallback(() => {
    writeStoredSite(site);
    setShareMode(null);
    setShareConfigUrl('');
    window.history.replaceState({}, '', window.location.pathname);
  }, [site]);

  const createShareUrl = useCallback((pathname = '/') => buildShareUrl(site, pathname), [site]);

  const createConfigPreviewUrl = useCallback((configUrl, pathname = '/') => {
    const url = new URL(pathname, window.location.origin);
    url.searchParams.set('config', configUrl);
    return url.toString();
  }, []);

  const value = useMemo(() => ({
    site,
    loading,
    shareMode,
    shareConfigUrl,
    isPreviewMode: Boolean(shareMode),
    updateSite,
    resetSite,
    exportJson,
    importJson,
    importSharedPreview,
    createShareUrl,
    createConfigPreviewUrl,
    isShareUrlTooLong,
    getPublishedUrl: () => getPublishedUrl(site),
  }), [
    site,
    loading,
    shareMode,
    shareConfigUrl,
    updateSite,
    resetSite,
    exportJson,
    importJson,
    importSharedPreview,
    createShareUrl,
    createConfigPreviewUrl,
  ]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
