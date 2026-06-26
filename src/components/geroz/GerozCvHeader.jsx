import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ShareButton from '../ui/ShareButton.jsx';
import { useGerozContent } from '../../hooks/geroz/useGerozContent.js';
import { scrollGerozToHash } from '../../animations/gerozAnimations.js';

function ShareIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4m0 0 4 4m-4-4-4 4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NavLinks({ links, className, linkClassName, onNavigate }) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className={`${linkClassName}${link.isCta ? ' geroz-cv-header__cta' : ''}`}
            onClick={(e) => {
              if (link.isHash) {
                e.preventDefault();
                scrollGerozToHash(link.href);
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

function MobileDrawer({ open, brand, links, onClose }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`geroz-cv-header__drawer-root ${open ? 'is-open' : ''}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="geroz-cv-header__drawer-backdrop"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />
      <aside
        id="geroz-mobile-nav"
        className="geroz-cv-header__drawer"
        aria-label="Main"
      >
        <div className="geroz-cv-header__drawer-head">
          <span className="geroz-cv-header__drawer-brand">{brand}</span>
          <button
            type="button"
            className="geroz-cv-header__drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <NavLinks
          links={links}
          className="geroz-cv-header__drawer-links"
          linkClassName="geroz-cv-header__drawer-link"
          onNavigate={onClose}
        />
      </aside>
    </div>,
    document.body,
  );
}

export default function GerozCvHeader() {
  const { nav } = useGerozContent();
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const syncHeight = () => {
      document.documentElement.style.setProperty('--geroz-header-height', `${el.offsetHeight}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', menuOpen && isMobile);
    return () => document.body.classList.remove('overflow-hidden');
  }, [menuOpen, isMobile]);

  useEffect(() => {
    if (!menuOpen || !isMobile) return undefined;

    const onEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen, isMobile]);

  const closeMenu = () => setMenuOpen(false);
  const brand = nav.brand || 'Portfolio';

  return (
    <header
      ref={headerRef}
      className={`geroz-cv-header pointer-events-none fixed inset-x-0 top-0 z-[300] ${scrolled ? 'is-scrolled' : ''}`}
    >
      <div className="geroz-cv-header__inner pointer-events-auto">
        <a
          href="#top"
          className="geroz-cv-header__brand"
          onClick={(e) => {
            e.preventDefault();
            scrollGerozToHash('#top');
          }}
        >
          <span className="geroz-cv-header__brand-mark" aria-hidden="true" />
          <span className="geroz-cv-header__brand-text">{brand}</span>
        </a>

        <nav className="geroz-cv-header__nav hidden lg:block" aria-label="Main">
          <NavLinks
            links={nav.links}
            className="geroz-cv-header__nav-list"
            linkClassName="geroz-cv-header__nav-link"
          />
        </nav>

        <div className="geroz-cv-header__actions">
          <ShareButton className="geroz-cv-header__share group">
            {({ copied }) => (
              <>
                <span className="inline-flex leading-none" aria-hidden="true">
                  {copied ? <CheckIcon /> : <ShareIcon />}
                </span>
                <span className="max-sm:hidden">{copied ? 'Copied' : 'Share'}</span>
              </>
            )}
          </ShareButton>

          <button
            type="button"
            className={`geroz-cv-header__menu-btn lg:hidden ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="geroz-mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {isMobile ? (
        <MobileDrawer open={menuOpen} brand={brand} links={nav.links} onClose={closeMenu} />
      ) : null}
    </header>
  );
}
