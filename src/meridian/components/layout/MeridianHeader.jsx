import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';
import { scrollMeridianToHash } from '../../../animations/meridianAnimations.js';
import { getLenis, subscribeScroll } from '../../../animations/scrollRuntime.js';
import MeridianColorPaletteSwitcher from './MeridianColorPaletteSwitcher.jsx';
import SocialLinks from '../../../components/shared/SocialLinks.jsx';

function MenuIcon() {
  return (
    <span className="meridian-menu-btn__icon" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

function NavLinks({ links, className, linkClassName, onNavigate, scrollToHash }) {
  const handleLinkClick = (event, link) => {
    if (link.isHash) {
      event.preventDefault();
      onNavigate?.();
      window.requestAnimationFrame(() => {
        scrollToHash(link.href);
      });
      return;
    }

    onNavigate?.();
  };

  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className={linkClassName}
            onClick={(event) => handleLinkClick(event, link)}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function MenuButton({ menuOpen, onHero, onToggle }) {
  return (
    <button
      type="button"
      className={`meridian-menu-btn meridian-liquid-fill meridian-magnetic ${menuOpen ? 'is-open' : ''} ${onHero ? 'meridian-menu-btn--on-hero' : ''}`}
      data-magnetic-strength="0.38"
      data-magnetic-label-strength="0"
      onClick={onToggle}
      aria-expanded={menuOpen}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
    >
      <span className="meridian-liquid-fill__wave" aria-hidden="true" />
      <MenuIcon />
    </button>
  );
}

function HeaderActions({ menuOpen, onHero, onToggleMenu }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={`meridian-header__actions ${onHero ? 'meridian-header__actions--on-hero' : ''}`}>
      {!menuOpen ? (
        <MeridianColorPaletteSwitcher onHero={onHero} className="meridian-palette--header" />
      ) : null}
      <MenuButton menuOpen={menuOpen} onHero={onHero} onToggle={onToggleMenu} />
    </div>,
    document.body,
  );
}

function MenuDrawer({ open, links, social, onClose, scrollToHash }) {
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

        <SocialLinks
          links={social}
          className="meridian-menu__social"
          itemClassName="meridian-menu__social-item"
          linkClassName="meridian-menu__social-link"
          iconSize={16}
        />
      </aside>
    </div>,
    document.body,
  );
}

export default function MeridianHeader() {
  const { nav, social } = useMeridianContent();
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const heroEl = document.querySelector('.meridian-hero');
    if (!heroEl) return undefined;

    const syncOnHero = () => {
      const rect = heroEl.getBoundingClientRect();
      setOnHero(rect.bottom > window.innerHeight * 0.35);
    };

    syncOnHero();
    return subscribeScroll(syncOnHero);
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
        <div className="meridian-header__inner" />
      </header>

      <HeaderActions menuOpen={menuOpen} onHero={onHero} onToggleMenu={toggleMenu} />

      <MenuDrawer
        open={menuOpen}
        links={nav.drawerLinks}
        social={social}
        onClose={() => setMenuOpen(false)}
        scrollToHash={scrollMeridianToHash}
      />
    </>
  );
}
