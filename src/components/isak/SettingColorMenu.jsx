import { createContext, useCallback, useEffect, useState } from 'react';
import { useIsakTheme } from './IsakThemeProvider.jsx';
import {
  COLOR_VARIANT_STORAGE_KEY,
  applyColorVariant,
  colorSwatches,
  getColorSwatch,
  getDefaultColorBodyClass,
} from '../../data/isak/colors.js';

const SettingColorContext = createContext(null);

export function SettingColorProvider({ defaultMode = 'dark', forceMode, children }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { setTheme } = useIsakTheme();

  const applyVariant = useCallback((bodyClass) => {
    const swatch = applyColorVariant(bodyClass);
    if (!swatch) return;

    setTheme(swatch.mode);
    setActive(swatch.bodyClass);
    localStorage.setItem(COLOR_VARIANT_STORAGE_KEY, swatch.bodyClass);
  }, [setTheme]);

  useEffect(() => {
    if (forceMode) {
      const fallbackClass = getDefaultColorBodyClass(forceMode);
      applyColorVariant(fallbackClass);
      setActive(fallbackClass);
      setTheme(forceMode);
      return;
    }

    const saved = localStorage.getItem(COLOR_VARIANT_STORAGE_KEY);
    const savedSwatch = getColorSwatch(saved);

    if (savedSwatch) {
      applyColorVariant(savedSwatch.bodyClass);
      setActive(savedSwatch.bodyClass);
      setTheme(savedSwatch.mode);
      return;
    }

    const fallbackClass = getDefaultColorBodyClass(defaultMode);
    applyColorVariant(fallbackClass);
    setActive(fallbackClass);
    setTheme(defaultMode);
    localStorage.setItem(COLOR_VARIANT_STORAGE_KEY, fallbackClass);
  }, [defaultMode, forceMode, setTheme]); // eslint-disable-line react-hooks/exhaustive-deps -- init once per page mode

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.body.classList.add('offcanvas-open');
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.classList.remove('offcanvas-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <SettingColorContext.Provider value={{ open, setOpen, active, applyVariant }}>
      {children}

      <div
        className={`offcanvas offcanvas-end offcanvas-color${open ? ' show' : ''}`}
        id="settingColorMenu"
        aria-hidden={!open}
      >
        <div className="offcanvas-content">
          <div className="canvas-header">
            <h5 className="letter-space--2">Configuration</h5>
            <span
              className="icon-close-popup"
              onClick={() => setOpen(false)}
              role="button"
              tabIndex={0}
              aria-label="Close color settings"
              onKeyDown={(e) => e.key === 'Enter' && setOpen(false)}
            >
              <i className="icon-close" />
            </span>
          </div>

          <div className="canvas-body">
            <h6 className="title">Color</h6>
            <div className="settings-color">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.bodyClass}
                  type="button"
                  className={`choose-item${active === swatch.bodyClass ? ' active' : ''}`}
                  aria-label={swatch.label}
                  aria-pressed={active === swatch.bodyClass}
                  onClick={() => applyVariant(swatch.bodyClass)}
                >
                  <span className={`color ${swatch.className}`} />
                  <span className="text">{swatch.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </SettingColorContext.Provider>
  );
}
