/**
 * Geroz template image map — uses existing GoodWork project assets as placeholders.
 * Update paths here when final template art is ready.
 */
export const GEROZ_TEMPLATE_IMAGES = {
  hero: '/images/profiles/sanjay.png',
  heroBg: '/images/landing/image1.png',
  video: '/videos/video-cv-poster.jpg',
  logoBlack: '/images/goodwork/goodwork-logo-full-colour.png',
  logoWhite: '/images/goodwork/logo-white.svg',
  expert: '/images/profiles/sanjay.png',
  footerBg: '/images/landing/imag2.png',
  footerBgAlt: '/images/landing/image1.png',
  ctaShape: '/images/goodwork/goodwork-logo-on-dark.png',
  cases: [
    '/images/landing/image1.png',
    '/images/landing/imag2.png',
    '/images/profiles/image1.png',
    '/images/profiles/imag2.png',
  ],
};

/** Decorative shapes for Screen 2 expertise column. */
export const GEROZ_DECOR_SHAPES = {
  /** Small 8-point star — shape-1.png (33×33) */
  star: '/assets/geroz/shapes/shape-1.png',
  /** Large 10-point star — shape-3.png (79×76), top accent with fade animation */
  starLarge: '/assets/geroz/shapes/shape-3.png',
  /** 16-point sunburst — shape-16.png (42×42) */
  sunburst: '/assets/geroz/shapes/shape-16.png',
  // Legacy aliases used by DecorShapes (.shape-1 / .shape-2 / .shape-3)
  small: '/assets/geroz/shapes/shape-1.png',
  large: '/assets/geroz/shapes/shape-3.png',
  medium: '/assets/geroz/shapes/shape-16.png',
};

/** Apply SCSS background-image placeholders on the Geroz route root. */
export function applyGerozImageCssVars(
  images = GEROZ_TEMPLATE_IMAGES,
  root = document.documentElement,
) {
  const { heroBg, footerBg, footerBgAlt, video } = images;
  root.style.setProperty('--geroz-img-hero-bg', `url("${heroBg}")`);
  root.style.setProperty('--geroz-img-footer-bg', `url("${footerBg}")`);
  root.style.setProperty('--geroz-img-footer-bg-alt', `url("${footerBgAlt}")`);
  root.style.setProperty('--geroz-img-video-fallback', `url("${video}")`);
}

export function clearGerozImageCssVars(root = document.documentElement) {
  [
    '--geroz-img-hero-bg',
    '--geroz-img-footer-bg',
    '--geroz-img-footer-bg-alt',
    '--geroz-img-video-fallback',
  ].forEach((name) => root.style.removeProperty(name));
}

function getGerozThemeTargets(root = document.documentElement) {
  const targets = [root];
  if (document.body && document.body !== root) {
    targets.push(document.body);
  }
  return targets;
}

/** Apply GoodWork brand colours from site.json onto the Geroz route. */
export function applyGerozThemeCssVars(
  theme = {},
  root = document.documentElement,
) {
  const { purple, orange, bgWarm, grey, accent } = theme;
  const accentColor = orange ?? accent;

  getGerozThemeTargets(root).forEach((el) => {
    if (purple) el.style.setProperty('--brand-purple', purple);
    if (accentColor) {
      el.style.setProperty('--brand-orange', accentColor);
      el.style.setProperty('--color-lawyer', accentColor);
    }
    if (bgWarm) el.style.setProperty('--brand-bg-warm', bgWarm);
    if (grey) el.style.setProperty('--brand-grey', grey);
  });
}

export function clearGerozThemeCssVars(root = document.documentElement) {
  const names = [
    '--brand-purple',
    '--brand-orange',
    '--brand-bg-warm',
    '--brand-grey',
    '--color-lawyer',
  ];

  getGerozThemeTargets(root).forEach((el) => {
    names.forEach((name) => el.style.removeProperty(name));
  });
}
