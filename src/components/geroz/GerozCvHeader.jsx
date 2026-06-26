import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ShareButton from '../ui/ShareButton.jsx';
import { useGerozContent } from '../../hooks/geroz/useGerozContent.js';

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4m0 0 4 4m-4-4-4 4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function scrollToHash(href) {
  if (!href.startsWith('#')) return;
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const navLinkClass =
  'font-sans text-[0.9375rem] font-medium text-stone-900 no-underline transition-colors hover:text-lawyer focus-visible:text-lawyer';

const navCtaClass =
  'rounded-full bg-lawyer px-[1.1rem] py-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.03em] text-white no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--color-lawyer)_88%,#000)] focus-visible:bg-[color-mix(in_srgb,var(--color-lawyer)_88%,#000)]';

function NavLinks({ links, className, linkClassName, onNavigate }) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className={`${linkClassName}${link.isCta ? ` ${navCtaClass}` : ''}`}
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

function MobileNav({ open, links, onClose }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[299] transition-[opacity,visibility] duration-250 ${
        open
          ? 'visible opacity-100 pointer-events-auto'
          : 'invisible opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 m-0 cursor-pointer border-0 bg-[rgba(12,10,9,0.42)] p-0"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />
      <nav
        className="absolute top-[var(--geroz-header-height)] right-0 left-0 border-b border-stone-900/8 bg-white/[0.98] px-6 pt-5 pb-6 shadow-[0_16px_40px_rgba(12,10,9,0.08)]"
        aria-label="Main"
      >
        <NavLinks
          links={links}
          className="m-0 flex list-none flex-col items-stretch gap-1 p-0"
          linkClassName="block px-1 py-3.5 font-sans text-base font-medium text-stone-900 no-underline transition-colors hover:text-lawyer focus-visible:text-lawyer [&.rounded-full]:mt-2 [&.rounded-full]:text-center"
          onNavigate={onClose}
        />
      </nav>
    </div>,
    document.body,
  );
}

export default function GerozCvHeader() {
  const { nav } = useGerozContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[300] border-b border-stone-900/8 bg-white/88 shadow-[0_4px_24px_rgba(12,10,9,0.04)] backdrop-blur-[14px]">
      <div className="pointer-events-auto mx-auto flex min-h-16 w-full max-w-[1320px] items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          className={`inline-flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5 border-0 bg-transparent p-0 lg:hidden ${
            menuOpen ? '[&>span:first-child]:translate-y-1 [&>span:first-child]:rotate-45 [&>span:last-child]:-translate-y-1 [&>span:last-child]:-rotate-45' : ''
          }`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="geroz-mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="block h-0.5 w-[1.35rem] bg-stone-900 transition-[transform,opacity] duration-250" />
          <span className="block h-0.5 w-[1.35rem] bg-stone-900 transition-[transform,opacity] duration-250" />
        </button>

        <nav className="hidden flex-1 lg:block" aria-label="Main">
          <NavLinks
            links={nav.links}
            className="m-0 flex list-none items-center gap-[clamp(1.25rem,3vw,2.5rem)] p-0"
            linkClassName={navLinkClass}
          />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <ShareButton className="group inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-lawyer)_70%,#d6d3d1)] bg-white px-4 py-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-stone-900 transition-[background-color,border-color,color] duration-250 hover:border-lawyer hover:bg-lawyer hover:text-white max-sm:size-10 max-sm:min-w-10 max-sm:p-0">
            {({ copied }) => (
              <>
                <span className="inline-flex leading-none" aria-hidden="true">
                  {copied ? <CheckIcon /> : <ShareIcon />}
                </span>
                <span className="max-sm:hidden">{copied ? 'Copied!' : 'Share'}</span>
              </>
            )}
          </ShareButton>
        </div>
      </div>

      {isMobile ? (
        <MobileNav open={menuOpen} links={nav.links} onClose={closeMenu} />
      ) : null}
    </header>
  );
}
