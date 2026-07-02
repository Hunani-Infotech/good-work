import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { scrollToShoooteAnchor } from '../../animations/shoooteAnimations.js';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import ShareButton from '../ui/ShareButton.jsx';
import SocialLinks from '../shared/SocialLinks.jsx';

function NavMenu({ navLinks, onClose, onHashClick }) {
  return (
    <div id="navbar" className="navigation-holder shooote-nav__menu show">
      <ul className="nav navbar-nav shooote-nav__list">
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

function MobileNavOverlay({ open, navLinks, social, onClose, onHashClick }) {
  return (
    <div
      id="shooote-mobile-nav"
      className={`shooote-mobile-nav${open ? ' shooote-mobile-nav--open' : ''}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="shooote-mobile-nav__backdrop"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />
      <nav className="shooote-mobile-nav__panel" aria-label="Main">
        <ul className="shooote-mobile-nav__list">
          {navLinks.map((link) => (
            <li key={link.label} className="shooote-mobile-nav__item">
              {link.isHash ? (
                <a
                  href={link.href}
                  className={`shooote-mobile-nav__link menu-link${link.className ? ` ${link.className}` : ''}`}
                  onClick={(e) => onHashClick(e, link.href)}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  href={link.href}
                  className={`shooote-mobile-nav__link${link.className ? ` ${link.className}` : ''}`}
                  onClick={onClose}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <SocialLinks
          links={social}
          className="shooote-mobile-nav__social"
          linkClassName="shooote-nav__social-link"
          iconSize={16}
        />
      </nav>
    </div>
  );
}

export default function ShoooteHeader() {
  const { navLinks, social, SHOOOTE_BASE } = useShoooteContent();
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

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setTogglerClass('');
      }
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
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
      navLinks={navLinks}
      onClose={closeMenu}
      onHashClick={handleHashClick}
    />
  );

  return (
    <header
      id="header"
      className={`shooote-header${menuOpen && smallNav ? ' shooote-header--menu-open' : ''}`}
    >
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
                  aria-controls="shooote-mobile-nav"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar first-angle" />
                  <span className="icon-bar middle-angle" />
                  <span className="icon-bar last-angle" />
                </button>
              </div>

              <div className="navbar-header shooote-nav__brand-wrap">
                <Link className="navbar-brand shooote-nav__brand" to={SHOOOTE_BASE}>
                  <GoodWorkWordmark surface="light" className="shooote-nav__brand-logo" />
                </Link>
              </div>
            </div>

            {!smallNav && (
              <div className="shooote-nav__center">
                {menu}
              </div>
            )}

            <div className="shooote-nav__right">
              <SocialLinks
                links={social}
                className="shooote-nav__social"
                linkClassName="shooote-nav__social-link"
                iconSize={15}
              />

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
        ? createPortal(
          <MobileNavOverlay
            open={menuOpen}
            navLinks={navLinks}
            social={social}
            onClose={closeMenu}
            onHashClick={handleHashClick}
          />,
          document.body,
        )
        : null}
    </header>
  );
}
