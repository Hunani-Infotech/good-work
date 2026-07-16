import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  COLOR_VARIANT_STORAGE_KEY,
  getColorSwatch,
} from '../../../data/isak/colors.js';

const THEME_STORAGE_KEY = 'darkMode';

const IsakThemeContext = createContext({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

function readStoredTheme(defaultTheme) {
  const savedColor = localStorage.getItem(COLOR_VARIANT_STORAGE_KEY);
  const colorSwatch = getColorSwatch(savedColor);
  if (colorSwatch) return colorSwatch.mode;

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  return defaultTheme;
}

export function ThemeProvider({ children, defaultTheme = 'dark', forceTheme }) {
  const [theme, setThemeState] = useState(() => forceTheme || readStoredTheme(defaultTheme));

  useEffect(() => {
    if (forceTheme) {
      setThemeState(forceTheme);
    }
  }, [forceTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
  }, []);

  const resolvedTheme = theme;

  return (
    <IsakThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </IsakThemeContext.Provider>
  );
}

export function useIsakTheme() {
  return useContext(IsakThemeContext);
}
