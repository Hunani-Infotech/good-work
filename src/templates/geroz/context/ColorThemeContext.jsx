import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { applyGerozThemeCssVars } from '../../../data/geroz/constants.js';
import {
  DEFAULT_GEROZ_COLOR_THEME_INDEX,
  GEROZ_COLOR_THEMES,
  GEROZ_PALETTE_STORAGE_KEY,
  getGerozColorTheme,
  readStoredGerozColorThemeIndex,
} from '../../../data/geroz/gerozColorThemes.js';

const ColorThemeContext = createContext(null);

export function GerozColorThemeProvider({
  initialIndex = DEFAULT_GEROZ_COLOR_THEME_INDEX,
  children,
}) {
  const [colorThemeIndex, setColorThemeIndexState] = useState(() =>
    readStoredGerozColorThemeIndex(initialIndex),
  );
  const activeTheme = useMemo(
    () => getGerozColorTheme(colorThemeIndex),
    [colorThemeIndex],
  );

  const theme = useMemo(
    () => ({
      accent: activeTheme.accent,
      orange: activeTheme.accent,
      purple: activeTheme.secondary,
      shape: activeTheme.shape,
      onShape: activeTheme.onShape,
      bgWarm: activeTheme.bgWarm,
      softBg: activeTheme.softBg,
      grey: activeTheme.grey,
      onAccent: activeTheme.onAccent,
      accentText: activeTheme.accentText,
      colorThemeIndex,
      colorThemeId: activeTheme.id,
      colorThemeName: activeTheme.name,
    }),
    [activeTheme, colorThemeIndex],
  );

  useLayoutEffect(() => {
    applyGerozThemeCssVars(theme);
    document.documentElement.dataset.gerozTheme = activeTheme.id;
  }, [theme, activeTheme.id]);

  const setColorThemeIndex = (index) => {
    const safeIndex =
      Number.isFinite(index) && index >= 0
        ? index % GEROZ_COLOR_THEMES.length
        : DEFAULT_GEROZ_COLOR_THEME_INDEX >= 0
          ? DEFAULT_GEROZ_COLOR_THEME_INDEX
          : 0;
    setColorThemeIndexState(safeIndex);
    try {
      window.localStorage.setItem(GEROZ_PALETTE_STORAGE_KEY, String(safeIndex));
    } catch {
      /* ignore quota / private mode */
    }
  };

  const value = useMemo(
    () => ({
      colorThemeIndex,
      setColorThemeIndex,
      activeTheme,
      theme,
      palettes: GEROZ_COLOR_THEMES,
    }),
    [colorThemeIndex, activeTheme, theme],
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useGerozColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useGerozColorTheme must be used within GerozColorThemeProvider');
  }
  return context;
}
