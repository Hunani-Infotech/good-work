import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  MERIDIAN_COLOR_PALETTES,
  MERIDIAN_PALETTE_STORAGE_KEY,
  applyMeridianPaletteCssVars,
  clearMeridianPaletteCssVars,
  getMeridianPalette,
  readStoredMeridianPaletteIndex,
} from '../../../data/meridian/meridianColorPalettes.js';

const ColorThemeContext = createContext(null);

export function MeridianColorThemeProvider({
  children,
  desktopHeroOnMobile = false,
}) {
  const [paletteIndex, setPaletteIndex] = useState(
    () => readStoredMeridianPaletteIndex(),
  );
  const activePalette = useMemo(
    () => getMeridianPalette(paletteIndex),
    [paletteIndex],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add('meridian-template');
    body.classList.add('meridian-template');
    if (desktopHeroOnMobile) {
      root.classList.add('meridian-template--desktop-hero-mobile');
      body.classList.add('meridian-template--desktop-hero-mobile');
    }
    applyMeridianPaletteCssVars(activePalette);

    return () => {
      root.classList.remove('meridian-template');
      body.classList.remove('meridian-template');
      root.classList.remove('meridian-template--desktop-hero-mobile');
      body.classList.remove('meridian-template--desktop-hero-mobile');
      clearMeridianPaletteCssVars();
    };
  }, [activePalette, desktopHeroOnMobile]);

  const setPaletteIndexPersisted = (index) => {
    const safeIndex = Number.isFinite(index) && index >= 0
      ? index % MERIDIAN_COLOR_PALETTES.length
      : 0;
    setPaletteIndex(safeIndex);
    try {
      window.localStorage.setItem(MERIDIAN_PALETTE_STORAGE_KEY, String(safeIndex));
    } catch {
      /* ignore */
    }
  };

  const value = useMemo(
    () => ({
      paletteIndex,
      setPaletteIndex: setPaletteIndexPersisted,
      activePalette,
      palettes: MERIDIAN_COLOR_PALETTES,
    }),
    [paletteIndex, activePalette],
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useMeridianColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useMeridianColorTheme must be used within MeridianColorThemeProvider');
  }
  return context;
}
