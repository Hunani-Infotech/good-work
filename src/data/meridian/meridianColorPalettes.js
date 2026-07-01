/**
 * Meridian palettes — hero bg/text + button default/hover colors.
 */
export const MERIDIAN_COLOR_PALETTES = [
  {
    id: 'classic',
    name: 'Classic',
    accent: '#455ce9',
    heroBg: '#ffffff',
    heroBgLight: '#fafafa',
    heroBgDark: '#f2f2f2',
    heroText: '#0a0a0a',
    heroVignette: 0.06,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: true,
  },
  {
    id: 'periwinkle',
    name: 'Periwinkle',
    accent: '#7b92e8',
    heroBg: '#7a8eb8',
    heroBgLight: '#9aa8d0',
    heroBgDark: '#5a6e98',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    accent: '#a894d4',
    heroBg: '#9488b0',
    heroBgLight: '#b0a4c8',
    heroBgDark: '#746890',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
  {
    id: 'blush',
    name: 'Blush',
    accent: '#e094a8',
    heroBg: '#b08898',
    heroBgLight: '#c8a4b0',
    heroBgDark: '#906878',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
  {
    id: 'sage',
    name: 'Sage',
    accent: '#84a894',
    heroBg: '#7a9484',
    heroBgLight: '#98b09c',
    heroBgDark: '#5a7464',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
  {
    id: 'peach',
    name: 'Peach',
    accent: '#e8a878',
    heroBg: '#b89878',
    heroBgLight: '#d0b494',
    heroBgDark: '#987858',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
  {
    id: 'mist',
    name: 'Mist',
    accent: '#78b8c8',
    heroBg: '#78a0ac',
    heroBgLight: '#94bcc8',
    heroBgDark: '#588088',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
  {
    id: 'butter',
    name: 'Butter',
    accent: '#d4bc78',
    heroBg: '#b0a078',
    heroBgLight: '#c8bc94',
    heroBgDark: '#908058',
    heroText: '#ffffff',
    heroVignette: 0.38,
    btnBg: '#ffffff',
    btnText: '#0a0a0a',
    btnHoverText: '#ffffff',
    isLight: false,
  },
];

export const MERIDIAN_PALETTE_STORAGE_KEY = 'meridian-palette-index';

export function getMeridianPalette(index = 0) {
  const safe = Number.isFinite(index) && index >= 0
    ? index % MERIDIAN_COLOR_PALETTES.length
    : 0;
  return MERIDIAN_COLOR_PALETTES[safe];
}

export function readStoredMeridianPaletteIndex() {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(MERIDIAN_PALETTE_STORAGE_KEY);
    const index = parseInt(raw, 10);
    return Number.isFinite(index) ? index % MERIDIAN_COLOR_PALETTES.length : 0;
  } catch {
    return 0;
  }
}

const PALETTE_CSS_PROPS = [
  '--meridian-accent',
  '--meridian-hero-bg',
  '--meridian-hero-bg-light',
  '--meridian-hero-bg-dark',
  '--meridian-hero-text',
  '--meridian-hero-vignette',
  '--meridian-btn-bg',
  '--meridian-btn-text',
  '--meridian-btn-hover-text',
  '--meridian-liquid-hover',
];

export function applyMeridianPaletteCssVars(palette) {
  if (typeof document === 'undefined' || !palette) return;

  const values = {
    '--meridian-accent': palette.accent,
    '--meridian-hero-bg': palette.heroBg,
    '--meridian-hero-bg-light': palette.heroBgLight,
    '--meridian-hero-bg-dark': palette.heroBgDark,
    '--meridian-hero-text': palette.heroText,
    '--meridian-hero-vignette': String(palette.heroVignette),
    '--meridian-btn-bg': palette.btnBg,
    '--meridian-btn-text': palette.btnText,
    '--meridian-btn-hover-text': palette.btnHoverText,
    '--meridian-liquid-hover': palette.accent,
  };

  const targets = [
    document.documentElement,
    document.body,
    document.getElementById('root'),
  ].filter(Boolean);

  targets.forEach((el) => {
    Object.entries(values).forEach(([prop, value]) => {
      el.style.setProperty(prop, value);
    });
  });

  document.documentElement.dataset.meridianPalette = palette.id;
  document.documentElement.dataset.meridianPaletteLight = palette.isLight ? 'true' : 'false';
}

export function clearMeridianPaletteCssVars() {
  if (typeof document === 'undefined') return;

  const targets = [document.documentElement, document.body, document.getElementById('root')]
    .filter(Boolean);

  targets.forEach((el) => {
    PALETTE_CSS_PROPS.forEach((prop) => el.style.removeProperty(prop));
  });

  delete document.documentElement.dataset.meridianPalette;
  delete document.documentElement.dataset.meridianPaletteLight;
}
