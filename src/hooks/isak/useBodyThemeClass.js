import { useEffect } from 'react';
import { useIsakTheme } from '../../templates/isak/components/IsakThemeProvider.jsx';

export function useBodyThemeClass({ defaultMode = 'dark' } = {}) {
  const { resolvedTheme } = useIsakTheme();

  useEffect(() => {
    const body = document.body;
    const currentTheme = resolvedTheme || defaultMode;

    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(currentTheme === 'dark' ? 'dark-mode' : 'light-mode');
  }, [resolvedTheme, defaultMode]);
}
