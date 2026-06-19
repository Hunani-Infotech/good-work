export const BRAND_LOGO_WHITE = {
  wordmark: '/images/goodwork/logo-on-dark.svg',
  symbol: '/images/goodwork/symbol-on-dark.svg',
};

export function resolveBrandLogoSrc(type, assets = {}) {
  if (type === 'symbol') {
    return assets.symbolOnDark || assets.logoWhite || BRAND_LOGO_WHITE.symbol;
  }

  return assets.logoOnDark || assets.logoWhite || BRAND_LOGO_WHITE.wordmark;
}
