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
} from '../../data/meridian/meridianColorPalettes.js';

const MeridianColorThemeContext = createContext(null);

export function MeridianColorThemeProvider({ children }) {
  const [paletteIndex, setPaletteIndex] = useState(
    () => readStoredMeridianPaletteIndex(),
  );
  const activePalette = useMemo(
    () => getMeridianPalette(paletteIndex),
    [paletteIndex],
  );

  useLayoutEffect(() => {
    document.documentElement.classList.add('meridian-template');
    document.body.classList.add('meridian-template');
    applyMeridianPaletteCssVars(activePalette);

    return () => {
      document.documentElement.classList.remove('meridian-template');
      document.body.classList.remove('meridian-template');
      clearMeridianPaletteCssVars();
    };
  }, [activePalette]);

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
    <MeridianColorThemeContext.Provider value={value}>
      {children}
    </MeridianColorThemeContext.Provider>
  );
}

export function useMeridianColorTheme() {
  const context = useContext(MeridianColorThemeContext);
  if (!context) {
    throw new Error('useMeridianColorTheme must be used within MeridianColorThemeProvider');
  }
  return context;
}
