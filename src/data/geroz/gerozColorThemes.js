/**
 * Good Work CV colour palettes — matched to reference frames in
 * "Good Work/Frame 1.png" … "Frame 8.png".
 *
 * `accent` → --brand-orange (primary highlight)
 * `secondary` → --brand-purple (overlay / gradient pair)
 * `bgWarm` → page & hero cream/light background
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
];

export function getGerozColorTheme(index = 0) {
  const safeIndex =
    Number.isFinite(index) && index >= 0
      ? index % GEROZ_COLOR_THEMES.length
      : 0;
  return GEROZ_COLOR_THEMES[safeIndex];
}
