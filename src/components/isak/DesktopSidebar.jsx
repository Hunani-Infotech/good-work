import { useIsakTheme } from './IsakThemeProvider.jsx';
import { navItems } from '../../data/isak/nav.js';
import { getLenis } from '../../animations/scrollRuntime.js';
import {
  COLOR_VARIANT_STORAGE_KEY,
  applyColorVariant,
  getDefaultColorBodyClass,
  isColorBodyClass,
} from '../../data/isak/colors.js';

const LIGHT_TO_DARK = {
  'body-default': 'dark-v1',
  'body-v1': 'dark-v1',
  'body-v2': 'dark-v2',
  'body-v3': 'dark-v3',
};

const DARK_TO_LIGHT = {
  'dark-v1': 'body-v1',
  'dark-v2': 'body-v2',
  'dark-v3': 'body-v3',
};

export function DesktopSidebar({ positionClass = 'pst-v1' }) {
  const { theme, setTheme } = useIsakTheme();

  const handleToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const currentClass = [...document.body.classList].find(isColorBodyClass)
      || getDefaultColorBodyClass(theme);
    const nextClass = next === 'dark'
      ? (LIGHT_TO_DARK[currentClass] || 'dark-v1')
      : (DARK_TO_LIGHT[currentClass] || 'body-default');

    applyColorVariant(nextClass);
    localStorage.setItem(COLOR_VARIANT_STORAGE_KEY, nextClass);
    setTheme(next);
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -132, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goTop = (e) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`sidebar-tools ${positionClass}`}>
      {/* <div className="nav-top">
        <div
          className={`tf-btn-icon toggle-switch-mode${theme === 'dark' ? ' active' : ''}`}
          onClick={handleToggle}
        >
          <i className="icon icon-light" />
        </div>
      </div> */}
      <ul className="nav-list">
        {navItems.map((item, i) => (
          <li key={item.href + i} className="nav-item">
            <a
              href={item.href}
              className="item-link scroll-link"
              onClick={(e) => scrollToSection(e, item.href)}
            >
              <i className={`icon ${item.icon}`} />
              <p className="tool-tip text-caption">{item.label}</p>
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-bottom">
        <a href="#" className="tf-btn-icon go-top" onClick={goTop}>
          <i className="icon icon-arrow-top" />
        </a>
      </div>
    </div>
  );
}
