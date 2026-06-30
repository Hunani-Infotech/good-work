import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';
import { scrollMeridianToHash } from '../../../animations/meridianAnimations.js';
import { getLenis } from '../../../animations/scrollRuntime.js';

function MenuIcon() {
  return (
    <span className="meridian-menu-btn__icon" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

function NavLinks({ links, className, linkClassName, onNavigate, scrollToHash }) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className={linkClassName}
            onClick={(e) => {
              if (link.isHash) {
                e.preventDefault();
                scrollToHash(link.href);
              }
              onNavigate?.();
            }}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function MenuButton({ menuOpen, onHero, onToggle }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <button
      type="button"
      className={`meridian-menu-btn ${menuOpen ? 'is-open' : ''} ${onHero ? 'meridian-menu-btn--on-hero' : ''}`}
      onClick={onToggle}
      aria-expanded={menuOpen}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
    >
      <MenuIcon />
    </button>,
    document.body,
  );
}

function MenuDrawer({ open, links, onClose, scrollToHash }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={`meridian-menu__root ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button type="button" className="meridian-menu__backdrop" onClick={onClose} aria-label="Close menu" />
      <aside className="meridian-menu__panel" aria-label="Navigation">
        <div className="meridian-menu__panel-head">
          <p className="meridian-menu__panel-label">Navigation</p>
        </div>
        <NavLinks
          links={links}
          className="meridian-menu__links"
          linkClassName="meridian-menu__link"
          onNavigate={onClose}
          scrollToHash={scrollToHash}
        />
      </aside>
    </div>,
    document.body,
  );
}

export default function MeridianHeader() {
  const { nav, hero } = useMeridianContent();
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const heroEl = document.querySelector('.meridian-hero');
    if (!heroEl) return undefined;

    const onScroll = () => {
      const rect = heroEl.getBoundingClientRect();
      setOnHero(rect.bottom > window.innerHeight * 0.35);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const syncHeight = () => {
      const height = el.querySelector('.meridian-header__inner')?.offsetHeight ?? el.offsetHeight;
      document.documentElement.style.setProperty('--meridian-header-height', `${height}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('meridian-menu-open', menuOpen);
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      document.body.classList.remove('meridian-menu-open');
      getLenis()?.start();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <>
      <header
        ref={headerRef}
        className={`meridian-header ${onHero ? 'meridian-header--on-hero' : ''}`}
      >
        <div className="meridian-header__inner">
          {onHero ? (
            <a
              href="#top"
              className="meridian-header__credit"
              onClick={(e) => {
                e.preventDefault();
                scrollMeridianToHash('#top');
              }}
            >
              {hero.creditLabel}
            </a>
          ) : null}
        </div>
      </header>

      <MenuButton menuOpen={menuOpen} onHero={onHero} onToggle={toggleMenu} />

      <MenuDrawer
        open={menuOpen}
        links={nav.drawerLinks}
        onClose={() => setMenuOpen(false)}
        scrollToHash={scrollMeridianToHash}
      />
    </>
  );
}
