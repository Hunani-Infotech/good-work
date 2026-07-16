import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { applyGerozThemeCssVars } from '../../../data/geroz/constants.js';
import {
  GEROZ_COLOR_THEMES,
  getGerozColorTheme,
} from '../../../data/geroz/gerozColorThemes.js';

const ColorThemeContext = createContext(null);

export function GerozColorThemeProvider({ initialIndex = 0, children }) {
  const [colorThemeIndex, setColorThemeIndex] = useState(initialIndex);
  const activeTheme = useMemo(
    () => getGerozColorTheme(colorThemeIndex),
    [colorThemeIndex],
  );

  const theme = useMemo(
    () => ({
      accent: activeTheme.accent,
      orange: activeTheme.accent,
      purple: activeTheme.secondary,
      bgWarm: activeTheme.bgWarm,
      grey: activeTheme.grey,
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
