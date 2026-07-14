import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import { GOODWORK_APP_URL } from '../../utils/brandLogos.js';

/**
 * Standard GoodWork footer branding — logo, powered-by line, and optional copyright.
 * Used across all individual CV templates for consistent footer identity.
 *
 * @param {'light' | 'dark'} surface — background the logo sits on
 * @param {'default' | 'badge'} variant — page footer vs. tidal-copper section badge
 * @param {'full' | 'logo' | 'copy'} part — full block, logo link only, or copy lines only
 */
export default function GoodWorkFooterBrand({
  surface = 'dark',
  variant = 'default',
  part = 'full',
  className = '',
  logoClassName = '',
  logoLinkClassName = '',
  dark = false,
}) {
  const badgeSurface = dark ? 'light' : 'dark';

  if (variant === 'badge') {
    return (
      <a
        href={GOODWORK_APP_URL}
        className={`cv-powered-by${dark ? ' cv-powered-by--dark' : ''}${className ? ` ${className}` : ''}`}
        aria-label="Powered by GoodWork — visit GoodWork"
      >
        <GoodWorkWordmark animated surface={badgeSurface} className="cv-powered-by__logo" />
        <span className="cv-powered-by__text">Powered by GoodWork</span>
      </a>
    );
  }

  if (part === 'logo') {
    return (
      <a
        href={GOODWORK_APP_URL}
        className={`gw-footer-brand__logo-link${logoLinkClassName ? ` ${logoLinkClassName}` : ''}${className ? ` ${className}` : ''}`}
        aria-label="GoodWork — visit app"
      >
        <GoodWorkWordmark
          animated
          surface={surface}
          className={`gw-footer-brand__logo${logoClassName ? ` ${logoClassName}` : ''}`}
        />
      </a>
    );
  }

  if (part === 'copy') {
    return (
      <>
        <span className={`gw-footer-brand__powered${className ? ` ${className}` : ''}`}>
          Powered by GoodWork
        </span>
      </>
    );
  }

  return (
    <div className={`gw-footer-brand${className ? ` ${className}` : ''}`}>
      <a
        href={GOODWORK_APP_URL}
        className={`gw-footer-brand__logo-link${logoLinkClassName ? ` ${logoLinkClassName}` : ''}`}
        aria-label="GoodWork — visit app"
      >
        <GoodWorkWordmark
          animated
          surface={surface}
          className={`gw-footer-brand__logo${logoClassName ? ` ${logoClassName}` : ''}`}
        />
      </a>
      <p className="gw-footer-brand__copy">
        <span className="gw-footer-brand__powered">Powered by GoodWork</span>
      </p>
    </div>
  );
}
