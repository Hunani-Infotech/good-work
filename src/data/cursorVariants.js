/**
 * Per-page cursor type + motion config.
 * Types: classic | glass | spotlight | magnetic | arrow | morph
 * Isak uses classic — styled in isak.css only.
 *
 * Meridian / Geroz use distinct arrow FX (not shared):
 * - meridian: editorial corner brackets
 * - geroz: lagging diamond trail
 */
const CURSOR_VARIANTS = {
  agency: {
    type: 'magnetic',
    ringLerp: 0.12,
    dotLerp: 0.35,
    magneticRadius: 90,
    magneticPull: 0.42,
  },
  'tidal-copper': {
    type: 'glass',
    ringLerp: 0.08,
    dotLerp: 1,
    hideDotOnHover: true,
  },
  meridian: {
    type: 'arrow',
    pointerStyle: 'meridian-custom',
    arrowLerp: 0.35,
    arrowFx: 'brackets',
    fxLerp: 0.1,
    magneticRadius: 72,
    magneticPull: 0.24,
  },
  geroz: {
    type: 'arrow',
    pointerStyle: 'classic',
    arrowLerp: 0.55,
    arrowFx: 'diamond-trail',
    trailCount: 3,
    trailLerps: [0.22, 0.12, 0.06],
  },
  shooote: {
    type: 'spotlight',
    ringLerp: 0.05,
    dotLerp: 1,
    spotlightLerp: 0.04,
  },
  'not-found': {
    type: 'morph',
    ringLerp: 0.18,
    dotLerp: 1,
    playfulMorph: true,
  },
  admin: {
    type: 'arrow',
    ringLerp: 0.35,
    dotLerp: 1,
    arrowLerp: 0.4,
  },
  isak: {
    type: 'classic',
    ringLerp: 0.1,
    dotLerp: 1,
  },
  default: {
    type: 'classic',
    ringLerp: 0.1,
    dotLerp: 1,
  },
};

export function getCursorVariantConfig(variant = 'default') {
  const config = CURSOR_VARIANTS[variant] ?? CURSOR_VARIANTS.default;
  const variantKey = config.styleVariant ?? variant;

  return {
    ...config,
    variantKey,
  };
}
