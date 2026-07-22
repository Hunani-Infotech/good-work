/**
 * Good Work CV colour palettes — matched to reference frames in
 * "Good Work/Frame 1.png" … "Frame 8.png".
 *
 * `accent` → --brand-orange (primary highlight / fills)
 * `secondary` → --brand-purple (overlay / gradient pair)
 * `bgWarm` → page & hero cream/light background
 * `onAccent` → text/icons on accent fills (white on dark accents, dark on yellow)
 * `accentText` → accent used as text on light backgrounds (readable contrast)
 */
export const GEROZ_COLOR_THEMES = [
  {
    id: 'orange',
    name: 'Good Work Orange',
    accent: '#f25828',
    secondary: '#c94a1f',
    bgWarm: '#faf8f5',
    grey: '#96908c',
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    accent: '#2b7de9',
    secondary: '#1557b0',
    bgWarm: '#e8f4ff',
    grey: '#6b8fa8',
  },
  {
    id: 'sage',
    name: 'Sage Green',
    accent: '#7a9482',
    secondary: '#5d7a75',
    bgWarm: '#f2f7f2',
    grey: '#7a8f82',
  },
  {
    id: 'periwinkle',
    name: 'Periwinkle',
    accent: '#8da9d4',
    secondary: '#6b8bb8',
    bgWarm: '#f9f7f2',
    grey: '#8a96a8',
    onAccent: '#1a1f2a',
    accentText: '#5a7199',
  },
  {
    id: 'teal',
    name: 'Deep Teal',
    accent: '#003030',
    secondary: '#004848',
    bgWarm: '#f5f5f5',
    grey: '#6b7a7a',
  },
  {
    id: 'olive',
    name: 'Muted Olive',
    accent: '#8b845b',
    secondary: '#6f6848',
    bgWarm: '#f5f2e8',
    grey: '#8a8778',
  },
  {
    id: 'plum',
    name: 'Muted Plum',
    accent: '#5d4e6d',
    secondary: '#4a3858',
    bgWarm: '#f7f3ee',
    grey: '#8a8290',
  },
  {
    id: 'coral',
    name: 'Coral',
    accent: '#ff5f6d',
    secondary: '#e84a58',
    bgWarm: '#ffffff',
    grey: '#9a9090',
  },
  {
    id: 'sunshine-glow',
    name: 'Sunshine Glow',
    accent: '#FFDD32',
    secondary: '#E6C200',
    bgWarm: '#FFF6CC',
    grey: '#9A8F78',
    onAccent: '#1a1600',
    accentText: '#8A7400',
  },
  {
    id: 'neon-yellow',
    name: 'Neon Yellow',
    accent: '#F0FF00',
    secondary: '#C8E600',
    bgWarm: '#FFFAE5',
    grey: '#8F8A70',
    onAccent: '#141200',
    accentText: '#6B7300',
  },
];

/** Default Geroz page palette — Neon Yellow. */
export const DEFAULT_GEROZ_COLOR_THEME_INDEX = GEROZ_COLOR_THEMES.findIndex(
  (theme) => theme.id === 'neon-yellow',
);

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
    onAccent: theme.onAccent ?? '#ffffff',
    accentText: theme.accentText ?? theme.accent,
  };
}
