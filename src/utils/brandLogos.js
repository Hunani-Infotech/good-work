/** Stacked wordmark — purple + orange, transparent (light backgrounds) */
export const GOODWORK_LOGO_ON_LIGHT = '/images/goodwork/goodwork-logo-full-colour-stacked.svg';

/** Stacked wordmark — white + orange, transparent (dark backgrounds) */
export const GOODWORK_LOGO_ON_DARK = '/images/goodwork/goodwork-logo-on-dark-stacked.svg';

/** @deprecated Use resolveGoodworkWordmark('dark') — PNG has opaque black background */
export const GOODWORK_LOGO_ORANGE = '/images/goodwork/goodwork-logo-orange.png';

export const BRAND_LOGO_WHITE = {
  wordmark: GOODWORK_LOGO_ON_DARK,
  symbol: '/images/goodwork/symbol-on-dark.svg',
};

/**
 * @param {'light' | 'dark'} surface — background the logo sits on
 */
export function resolveGoodworkWordmark(surface = 'light') {
  return surface === 'dark' ? GOODWORK_LOGO_ON_DARK : GOODWORK_LOGO_ON_LIGHT;
}

export function resolveBrandLogoSrc(type, assets = {}, surface = 'light') {
  if (type === 'symbol') {
    return assets.symbolOnDark || assets.logoWhite || BRAND_LOGO_WHITE.symbol;
  }

  if (surface === 'dark') {
    return assets.logoOnDark || assets.logoOrange || GOODWORK_LOGO_ON_DARK;
  }

  return assets.logoOnLight || assets.logoFullColour || GOODWORK_LOGO_ON_LIGHT;
}
