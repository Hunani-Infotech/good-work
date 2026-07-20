/** GoodWork app — main landing page for logo links on individual CV pages */
export const GOODWORK_APP_URL = 'https://app.goodwork.asia/';

/** Animated Malaysia Digital + GoodWork registration mark (individual CV pages) */
export const GOODWORK_ANIMATED_LOGO = '/images/goodwork/goodwork-md-logo.gif';

/** Animated GoodWork wordmark — shared site loader (all templates) */
export const GOODWORK_LOADER_LOGO = '/images/goodwork/goodwork-logo.gif';

/** Stacked wordmark — purple + orange, transparent (light backgrounds) */
export const GOODWORK_LOGO_ON_LIGHT = '/images/goodwork/goodwork-logo-full-colour-stacked.svg';

/** Stacked wordmark — white + orange, transparent (dark backgrounds) */
export const GOODWORK_LOGO_ON_DARK = '/images/goodwork/goodwork-logo-on-dark-stacked.svg';

/**
 * @param {'light' | 'dark'} surface — background the logo sits on
 */
export function resolveGoodworkWordmark(surface = 'light') {
  return surface === 'dark' ? GOODWORK_LOGO_ON_DARK : GOODWORK_LOGO_ON_LIGHT;
}

export function resolveGoodworkAnimatedLogo() {
  return GOODWORK_ANIMATED_LOGO;
}
