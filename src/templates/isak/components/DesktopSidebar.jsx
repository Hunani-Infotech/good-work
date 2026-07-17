import { navItems } from '../../../data/isak/nav.js';
import { getLenis } from '../../../animations/scrollRuntime.js';
import { ThemeModeToggle } from './ThemeModeToggle.jsx';

export function DesktopSidebar({ positionClass = 'pst-v1' }) {
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
      <div className="nav-top">
        <ThemeModeToggle />
      </div>
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
