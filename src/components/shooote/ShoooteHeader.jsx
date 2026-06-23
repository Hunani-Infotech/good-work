import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { scrollToShoooteAnchor } from '../../animations/shoooteAnimations.js';

import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';

import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';

import ShareButton from '../ui/ShareButton.jsx';



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

    document.body.classList.toggle('shooote-nav-open', menuOpen);

    return () => document.body.classList.remove('shooote-nav-open');

  }, [menuOpen]);



  useEffect(() => {

    const onBodyClick = () => {

      setMenuOpen(false);

      setTogglerClass('');

    };

    document.body.addEventListener('click', onBodyClick);

    return () => document.body.removeEventListener('click', onBodyClick);

  }, []);



  const toggleMenu = (e) => {

    e.stopPropagation();

    setMenuOpen((open) => !open);

    setTogglerClass((cls) => (cls ? '' : 'x-close'));

  };



  const closeMenu = () => {

    setMenuOpen(false);

    setTogglerClass('');

  };



  const handleHashClick = (e, href) => {

    if (!href.startsWith('#')) return;

    e.preventDefault();

    closeMenu();

    scrollToShoooteAnchor(href);

  };



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

                  <GoodWorkWordmark surface="light" className="shooote-nav__brand-logo" />

                </Link>

              </div>

            </div>



            <div className="shooote-nav__right">

              <div

                id="navbar"

                className={`collapse navbar-collapse navigation-holder shooote-nav__menu${menuOpen ? ' slideInn' : ''}${!smallNav ? ' show' : ''}`}

                onClick={(e) => e.stopPropagation()}

              >

                <button

                  type="button"

                  className="menu-close shooote-nav__menu-close"

                  onClick={(e) => {

                    e.stopPropagation();

                    closeMenu();

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

                          onClick={(e) => handleHashClick(e, link.href)}

                        >

                          {link.label}

                        </a>

                      ) : (

                        <a

                          href={link.href}

                          className={`shooote-nav__link${link.className ? ` ${link.className}` : ''}`}

                          onClick={closeMenu}

                        >

                          {link.label}

                        </a>

                      )}

                    </li>

                  ))}

                </ul>

              </div>



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

    </header>

  );

}


