/**
 * Good Work CV colour palettes — hero background variants from
 * hero-bg-palette-variants.html.
 *
 * Every palette uses exactly 3 hero shades (no shade omitted):
 *   `accent` / `bgWarm` → --brand-orange / --brand-bg-warm  (--base)
 *   `secondary`         → --brand-purple                   (--glow)
 *   `shape`             → --brand-hero-shape               (--shape)
 *   `onShape`           → --brand-on-shape (text/icons on shape fills)
 *
 * `softBg` is the soft companion for expertise / CTA / about.
 * `onAccent` → text/icons on accent fills
 * `accentText` → accent used as text on light backgrounds
 */
export const GEROZ_COLOR_THEMES = [
  {
    id: 'neon-yellow',
    name: 'Neon Yellow',
    accent: '#FFE500',
    secondary: '#C6FF00',
    shape: '#3355FF',
    bgWarm: '#FFE500',
    softBg: '#FFFFFF',
    grey: '#6B6B5C',
    onAccent: '#171717',
    onShape: '#FFFFFF',
    accentText: '#171717',
  },
  {
    id: 'sunset-blue',
    name: 'Sunset Blue',
    accent: '#EE5C27',
    secondary: '#FF8A4C',
    shape: '#2B7DE9',
    bgWarm: '#EE5C27',
    softBg: '#FAF8F5',
    grey: '#96908C',
    onAccent: '#FFFFFF',
    onShape: '#FFFFFF',
    accentText: '#C94A1F',
  },
  {
    id: 'sky-gold',
    name: 'Sky & Gold',
    accent: '#2B7DE9',
    secondary: '#8DA9D4',
    shape: '#FFDD32',
    bgWarm: '#2B7DE9',
    softBg: '#E8F4FF',
    grey: '#6B8FA8',
    onAccent: '#FFFFFF',
    onShape: '#171717',
    accentText: '#1557B0',
  },
  {
    id: 'deep-teal',
    name: 'Deep Teal',
    accent: '#003030',
    secondary: '#7A9482',
    shape: '#FF5F6D',
    bgWarm: '#003030',
    softBg: '#F5F5F5',
    grey: '#6B7A7A',
    onAccent: '#FFFFFF',
    onShape: '#FFFFFF',
    accentText: '#003030',
  },
  {
    id: 'earthy-khaki',
    name: 'Earthy Khaki',
    accent: '#8B845B',
    secondary: '#FFDD32',
    shape: '#5D4E6D',
    bgWarm: '#8B845B',
    softBg: '#F5F2E8',
    grey: '#8A8778',
    onAccent: '#FFFFFF',
    onShape: '#FFFFFF',
    accentText: '#6F6848',
  },
  {
    id: 'plum-coral',
    name: 'Plum Coral',
    accent: '#5D4E6D',
    secondary: '#8DA9D4',
    shape: '#FF5F6D',
    bgWarm: '#5D4E6D',
    softBg: '#F7F3EE',
    grey: '#8A8290',
    onAccent: '#FFFFFF',
    onShape: '#FFFFFF',
    accentText: '#4A3858',
  },
];

/** Default Geroz page palette — Neon Yellow. */
export const DEFAULT_GEROZ_COLOR_THEME_INDEX = GEROZ_COLOR_THEMES.findIndex(
  (theme) => theme.id === 'neon-yellow',
);

export const GEROZ_PALETTE_STORAGE_KEY = 'geroz-palette-index';

export function getGerozColorTheme(index = DEFAULT_GEROZ_COLOR_THEME_INDEX) {
  const fallback =
    DEFAULT_GEROZ_COLOR_THEME_INDEX >= 0 ? DEFAULT_GEROZ_COLOR_THEME_INDEX : 0;
  const safeIndex =
    Number.isFinite(index) && index >= 0
      ? index % GEROZ_COLOR_THEMES.length
      : fallback;
  const theme = GEROZ_COLOR_THEMES[safeIndex];
  return {
    ...theme,
    softBg: theme.softBg ?? '#ffffff',
    onAccent: theme.onAccent ?? '#ffffff',
    accentText: theme.accentText ?? theme.accent,
    shape: theme.shape ?? theme.secondary ?? theme.accent,
    onShape: theme.onShape ?? '#ffffff',
  };
}

export function readStoredGerozColorThemeIndex(
  fallback = DEFAULT_GEROZ_COLOR_THEME_INDEX,
) {
  const safeFallback =
    Number.isFinite(fallback) && fallback >= 0
      ? fallback % GEROZ_COLOR_THEMES.length
      : DEFAULT_GEROZ_COLOR_THEME_INDEX >= 0
        ? DEFAULT_GEROZ_COLOR_THEME_INDEX
        : 0;

  if (typeof window === 'undefined') return safeFallback;

  try {
    const raw = window.localStorage.getItem(GEROZ_PALETTE_STORAGE_KEY);
    if (raw == null) return safeFallback;
    const index = parseInt(raw, 10);
    return Number.isFinite(index)
      ? index % GEROZ_COLOR_THEMES.length
      : safeFallback;
  } catch {
    return safeFallback;
  }
}
