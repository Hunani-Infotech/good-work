import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

const MAX_SHARE_URL_LENGTH = 7500;

export function validateSiteShape(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid site JSON');
  }
  if (!data.site || !data.home) {
    throw new Error('Site JSON must include site and home sections');
  }
}

export function encodeSiteForShare(site) {
  return compressToEncodedURIComponent(JSON.stringify(site));
}

export function decodeSiteFromShare(param) {
  if (!param) return null;
  try {
    const json = decompressFromEncodedURIComponent(param);
    if (!json) return null;
    const data = JSON.parse(json);
    validateSiteShape(data);
    return data;
  } catch {
    return null;
  }
}

export function buildShareUrl(site, pathname = '/') {
  const encoded = encodeSiteForShare(site);
  const url = new URL(pathname, window.location.origin);
  url.searchParams.set('share', encoded);
  return url.toString();
}

export function isShareUrlTooLong(url) {
  return url.length > MAX_SHARE_URL_LENGTH;
}

export async function fetchSiteFromConfigUrl(configUrl) {
  const response = await fetch(configUrl, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Could not load config (${response.status})`);
  }
  const data = await response.json();
  validateSiteShape(data);
  return data;
}

export function parseShareSearchParams(search) {
  const params = new URLSearchParams(search);
  const shareParam = params.get('share');
  if (shareParam) {
    const site = decodeSiteFromShare(shareParam);
    if (site) return { site, mode: 'share' };
  }
  return null;
}

export async function resolveSiteFromSearchParams(search) {
  const params = new URLSearchParams(search);
  const configUrl = params.get('config');
  if (configUrl) {
    const site = await fetchSiteFromConfigUrl(configUrl);
    return { site, mode: 'config', configUrl };
  }
  const shared = parseShareSearchParams(search);
  if (shared) return shared;
  return null;
}

export function getPublishedUrl(site, fallbackOrigin = '') {
  const published = site?.site?.meta?.publishedUrl?.trim();
  if (published) return published;
  if (typeof window !== 'undefined') return window.location.origin;
  return fallbackOrigin;
}
