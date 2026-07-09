import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';

const DEFAULT_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/service' },
  { label: 'Works', to: '/project' },
  { label: 'Contact', to: '#cta' },
];

export default function GerozHeader({
  homeLink = '/',
  navLinks = DEFAULT_NAV_LINKS,
  mobileMenuOpen = false,
  onToggleMenu,
  onCloseMenu,
}) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', mobileMenuOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const onEscape = (e) => {
      if (e.key === 'Escape') onCloseMenu?.();
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [mobileMenuOpen, onCloseMenu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300${
          isSticky ? ' bg-stone-950/95 shadow-lg shadow-stone-950/50 backdrop-blur-md' : ' bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:py-5">
          <Link to={homeLink} className="relative z-50 shrink-0">
            <GoodWorkWordmark animated surface="dark" className="geroz-header__logo" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium uppercase tracking-wider text-stone-100 transition-colors hover:text-amber-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={onToggleMenu}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="geroz-mobile-nav"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`block h-0.5 w-6 bg-stone-100 transition-all duration-300${
                mobileMenuOpen ? ' translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-stone-100 transition-all duration-300${
                mobileMenuOpen ? ' opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-stone-100 transition-all duration-300${
                mobileMenuOpen ? ' -translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      <div
        id="geroz-mobile-nav"
        className={`fixed inset-0 z-40 lg:hidden${mobileMenuOpen ? '' : ' pointer-events-none'}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity duration-300${
            mobileMenuOpen ? ' opacity-100' : ' opacity-0'
          }`}
          onClick={onCloseMenu}
          aria-label="Close menu"
          tabIndex={mobileMenuOpen ? 0 : -1}
        />

        <nav
          className={`absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-stone-900 px-8 pb-10 pt-24 shadow-2xl transition-transform duration-300 ease-in-out${
            mobileMenuOpen ? ' translate-x-0' : ' translate-x-full'
          }`}
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={onCloseMenu}
                  className="block rounded-lg px-3 py-3 text-lg font-medium text-stone-100 transition-colors hover:bg-stone-800 hover:text-amber-500"
                  tabIndex={mobileMenuOpen ? 0 : -1}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
