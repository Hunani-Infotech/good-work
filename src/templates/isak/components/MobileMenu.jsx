import { useState } from 'react';
import { navItems } from '../../../data/isak/nav.js';
import { getLenis } from '../../../animations/scrollRuntime.js';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    document.body.classList.toggle('overflow-hidden', next);
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

  return (
    <>
      <div className="action-open-mobile d-lg-none">
        <div className="tf-btn-icon style-2" onClick={toggle}>
          <div className={`btn-mobile-menu${open ? ' close' : ''}`}>
            <span />
          </div>
        </div>
        <div className={`nav-mobile-list${open ? ' open' : ''}`}>
          <ul className="nav-mobile-item">
            {navItems.map((item, i) => (
              <div key={item.href + i}>
                <li className="nav-item">
                  <a
                    href={item.href}
                    className="item-link scroll-link"
                    onClick={(e) => {
                      setOpen(false);
                      scrollToSection(e, item.href);
                    }}
                  >
                    <i className={`icon ${item.icon}`} />
                    <p className="tool-tip text-caption">{item.label}</p>
                  </a>
                </li>
                {item.separator === 'after' && <li className="br-line" />}
              </div>
            ))}
          </ul>
        </div>
      </div>
      <div className={`overlay-pop${open ? ' open' : ''}`} onClick={toggle} />
    </>
  );
}
