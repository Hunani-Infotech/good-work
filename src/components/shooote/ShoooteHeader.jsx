import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { scrollToShoooteAnchor } from '../../animations/shoooteAnimations.js';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import ShareButton from '../ui/ShareButton.jsx';

function NavMenu({ menuOpen, smallNav, navLinks, onClose, onHashClick }) {
  const menuClassName = [
    'collapse navbar-collapse navigation-holder shooote-nav__menu',
    menuOpen && smallNav ? 'slideInn show' : '',
    !smallNav ? 'show' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      id="navbar"
      className={menuClassName}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="menu-close shooote-nav__menu-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close menu"
      >
        <i className="ti-close" />
      </button>
      <ul className={`nav navbar-nav shooote-nav__list${smallNav ? ' small-nav' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.label} className="shooote-nav__item">
            {link.isHash ? (
              <a
                href={link.href}
                className={`menu-link shooote-nav__link${link.className ? ` ${link.className}` : ''}`}
                onClick={(e) => onHashClick(e, link.href)}
              >
                {link.label}
              </a>
            ) : (
              <a
                href={link.href}
                className={`shooote-nav__link${link.className ? ` ${link.className}` : ''}`}
                onClick={onClose}
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ShoooteHeader() {
  const { navLinks, SHOOOTE_BASE } = useShoooteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [togglerClass, setTogglerClass] = useState('');
  const [smallNav, setSmallNav] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setTogglerClass('');
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 991;
      setSmallNav(mobile);
      if (!mobile) setMenuOpen(false);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('shooote-nav-open', menuOpen && smallNav);
    return () => document.body.classList.remove('shooote-nav-open');
  }, [menuOpen, smallNav]);

  useEffect(() => {
    if (!menuOpen || !smallNav) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onDismiss = (e) => {
      if (e.target.closest('.shooote-nav__toggle, #navbar, .shooote-nav__menu')) return;
      setMenuOpen(false);
      setTogglerClass('');
    };

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setTogglerClass('');
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener('click', onDismiss);
      document.addEventListener('keydown', onEscape);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', onDismiss);
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, smallNav]);

  const closeMenu = () => {
    setMenuOpen(false);
    setTogglerClass('');
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((open) => !open);
    setTogglerClass((cls) => (cls ? '' : 'x-close'));
  };

  const handleHashClick = (e, href) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    closeMenu();
    scrollToShoooteAnchor(href);
  };

  const menu = (
    <NavMenu
      menuOpen={menuOpen}
      smallNav={smallNav}
      navLinks={navLinks}
      onClose={closeMenu}
      onHashClick={handleHashClick}
    />
  );

  return (
    <header id="header" className="shooote-header">
      <div className="wpo-site-header">
        <nav className="navigation navbar navbar-expand-lg navbar-light shooote-nav" aria-label="Main">
          <div className="shooote-nav__bar">
            <div className="shooote-nav__left">
              <div className="mobail-menu shooote-nav__toggle-wrap">
                <button
                  type="button"
                  className={`navbar-toggler open-btn shooote-nav__toggle${togglerClass ? ` ${togglerClass}` : ''}`}
                  onClick={toggleMenu}
                  aria-expanded={menuOpen}
                  aria-controls="navbar"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar first-angle" />
                  <span className="icon-bar middle-angle" />
                  <span className="icon-bar last-angle" />
                </button>
              </div>

              <div className="navbar-header shooote-nav__brand-wrap">
                <Link className="navbar-brand shooote-nav__brand" to={SHOOOTE_BASE}>
                  <GoodWorkWordmark surface="dark" className="shooote-nav__brand-logo" />
                </Link>
              </div>
            </div>

            {!smallNav && (
              <div className="shooote-nav__center">
                {menu}
              </div>
            )}

            <div className="shooote-nav__right">
              <ShareButton className="shooote-share-btn shooote-nav__share">
                {({ copied }) => (
                  <>
                    <i className={`ti-${copied ? 'check' : 'share'}`} style={{ fontSize: '15px' }} />
                    <span className="tooltip-text">{copied ? 'Copied!' : 'Share'}</span>
                  </>
                )}
              </ShareButton>
            </div>
          </div>
        </nav>
      </div>

      {smallNav && typeof document !== 'undefined'
        ? createPortal(menu, document.body)
        : null}
    </header>
  );
}
