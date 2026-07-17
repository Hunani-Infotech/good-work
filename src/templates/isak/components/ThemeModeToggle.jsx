import { useIsakTheme } from './ThemeProvider.jsx';
import { useSettingColor } from './SettingColorMenu.jsx';

export function ThemeModeToggle() {
  const { theme } = useIsakTheme();
  const { toggleMode } = useSettingColor();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="tf-btn-icon toggle-switch-mode"
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <i className="icon icon-light" aria-hidden="true" />
    </button>
  );
}
